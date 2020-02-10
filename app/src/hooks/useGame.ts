import { useEffect, useReducer, createContext, useContext } from 'react';

import { GameDTO } from 'dtos/game.dto';
import { PlayerDTO } from 'dtos/player.dto';
import { ChoiceDTO } from 'dtos/choice.dto';
import { GameEvent } from 'dtos/events';

type SetPlayerAction = {
  type: 'setplayer';
  player?: PlayerDTO;
};

type SetGameAction = {
  type: 'setgame';
  game?: GameDTO;
};

type SetSelectionAction = {
  type: 'setselection';
  selection: ChoiceDTO[];
};

type Action = SetPlayerAction | SetGameAction | SetSelectionAction | GameEvent;

const playerReducer = (player: PlayerDTO | undefined, action: Action): PlayerDTO | undefined => {
  if (action.type === 'setplayer') {
    return action.player;
  }

  if (!player) {
    return;
  }

  if (action.type === 'cards') {
    return { ...player, cards: [...(player.cards || []), ...action.cards] };
  }

  if (action.type === 'next') {
    const newCards = [...player.cards || []];

    for (const card of player.selection || [])
      newCards.splice(newCards.findIndex(({ text }) => card.text === text), 1);

    return { ...player, cards: newCards, selection: [] };
  }

  if (action.type === 'end') {
    return {
      ...player,
      cards: undefined,
      selection: undefined,
    };
  }

  if (action.type === 'setselection') {
    return { ...player, selection: action.selection };
  }

  return player;
};

const gameReducer = (game: GameDTO | undefined, action: Action): GameDTO | undefined => {
  if (action.type === 'setgame') {
    return action.game;
  }

  if (!game) {
    return;
  }

  if (action.type === 'join') {
    return {
      ...game,
      players: [...game.players, action.player],
    };
  }

  if (action.type === 'connected') {
    const player = game.players.find((p: any) => p.nick === action.nick);

    if (!player) {
      console.warn('cannot find player: ' + action.nick);
      return game;
    }

    const idx = game.players.indexOf(player);

    return {
      ...game,
      players: [
        ...game.players.slice(0, idx),
        { ...player, connected: true },
        ...game.players.slice(idx + 1),
      ],
    };
  }

  if (action.type === 'disconnected') {
    const player = game.players.find((p: any) => p.nick === action.nick);

    if (!player) {
      console.warn('cannot find player: ' + action.nick);
      return game;
    }

    const idx = game.players.indexOf(player);

    return {
      ...game,
      players: [
        ...game.players.slice(0, idx),
        { ...player, connected: false },
        ...game.players.slice(idx + 1),
      ],
    };
  }

  if (action.type === 'start' || action.type === 'next') {
    return { ...game, ...action.game };
  }

  if (action.type === 'end') {
    return {
      ...game,
      ...action.game,
      playState: undefined,
      answers: undefined,
      question: undefined,
      questionMaster: undefined,
    };
  }

  if (action.type === 'answer') {
    return {
      ...game,
      answered: [
        ...(game.answered || []),
        action.nick,
      ],
    };
  }

  if (action.type === 'allanswers') {
    return {
      ...game,
      answers: action.answers,
      playState: 'question_master_selection',
    };
  }

  if (action.type === 'turn') {
    return {
      ...game,
      playState: 'end_of_turn',
      turns: [
        ...(game.turns || []),
        action.turn,
      ],
    };
  }

  return game;
};

const useGame = (socket: SocketIOClient.Socket) => {
  const [player, dispatchPlayer] = useReducer(playerReducer, undefined);
  const [game, dispatchGame] = useReducer(gameReducer, undefined);

  const dispatch = (action: Action) => {
    console.log('dispatch', action);
    dispatchPlayer(action);
    dispatchGame(action);
  };

  useEffect(() => {
    socket.on('message', dispatch);
    return () => void socket.off('message', dispatch);
  }, [socket]);

  useEffect(() => {
    if (player?.nick) {
      socket.emit('login', { nick: player.nick })
    }
  }, [player?.nick]);

  return {
    game,
    player,
    dispatch,
   } as const;
};

export default useGame;

export type Dispatch = (action: Action) => void;

const DispatchContext = createContext<Dispatch>(() => {});

export const DispatchProvider = DispatchContext.Provider;
export const useDispatch = () => useContext(DispatchContext);
