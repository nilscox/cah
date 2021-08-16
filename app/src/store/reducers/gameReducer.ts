import { GameState as GameStateEnum } from '../../../../shared/enums';
import { Answer } from '../../domain/entities/Answer';
import { Game, GameState as GS, PlayState, StartedGame } from '../../domain/entities/Game';
import { RTCMessage } from '../../domain/gateways/RTCGateway';
import { AppAction, NotNull, Nullable } from '../types';

import { append, remove, upsert } from './helpers';

export type GameState = Nullable<Game | StartedGame>;

const setPlayerConnected = (state: NotNull<GameState>, nick: string, isConnected: boolean): GameState => {
  return {
    ...state,
    players: upsert(state.players, (player) => player.nick === nick, { isConnected }),
  };
};

const findPlayer = (state: GameState, nick: string) => {
  return state?.players.find((player) => player.nick === nick);
};

const rtcMessageReducer = (state: NotNull<GameState>, message: RTCMessage): GameState => {
  if (message.type === 'PlayerConnected') {
    return setPlayerConnected(state, message.player, true);
  }

  if (message.type === 'PlayerDisconnected') {
    return setPlayerConnected(state, message.player, false);
  }

  if (message.type === 'GameJoined') {
    return {
      ...state,
      players: append(state.players, message.player),
    };
  }

  if (message.type === 'GameLeft') {
    return {
      ...state,
      players: remove(state.players, (player) => player.nick === message.player),
    };
  }

  if (message.type === 'GameStarted') {
    return {
      ...state,
      state: GS.started,
      totalQuestions: message.totalQuestions,
    };
  }

  if (message.type === 'TurnStarted') {
    return {
      ...state,
      playState: PlayState.playersAnswer,
      questionMaster: findPlayer(state, message.questionMaster),
      question: message.question,
    };
  }

  if (message.type === 'AllPlayersAnswered') {
    return {
      ...state,
      playState: PlayState.questionMasterSelection,
      answers: message.answers,
    };
  }

  if (message.type === 'WinnerSelected') {
    return {
      ...state,
      playState: PlayState.endOfTurn,
      answers: message.answers.map((answer) => ({
        ...answer,
        player: findPlayer(state, answer.player),
      })),
      winner: findPlayer(state, message.winner),
    };
  }

  if (message.type === 'TurnFinished') {
    const game = state as StartedGame;

    return {
      ...state,
      answers: [],
      winner: undefined,
      turns: append(game.turns, {
        number: game.turns.length + 1,
        question: game.question,
        answers: game.answers as Answer[],
        winner: game.winner!,
      }),
    };
  }

  if (message.type === 'GameFinished') {
    return {
      ...state,
      state: GameStateEnum.finished,
      playState: undefined,
      questionMaster: undefined,
      question: undefined,
      answers: undefined,
    };
  }

  return state;
};

export const gameReducer = (state: GameState = null, action: AppAction): GameState => {
  if (action.type === 'game/set') {
    return action.payload;
  }

  if (state === null) {
    return state;
  }

  if (action.type === 'game/set-turns') {
    return { ...state, turns: action.payload };
  }

  if (action.type === 'rtc/message') {
    return rtcMessageReducer(state, action.payload);
  }

  return state;
};
