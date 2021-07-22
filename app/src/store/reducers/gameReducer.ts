import { Game, GameState as GS, PlayState, StartedGame } from '../../interfaces/entities/Game';
import { RTCMessage } from '../../interfaces/gateways/RTCGateway';
import { replace } from '../../utils/tools';
import { AppAction, NotNull, Nullable } from '../types';

export type GameState = Nullable<Game | StartedGame>;

const setPlayerConnected = (state: NotNull<GameState>, nick: string, isConnected: boolean): GameState => {
  return {
    ...state,
    players: replace(state.players, (player) => player.nick === nick, { isConnected }),
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

  if (message.type === 'GameStarted') {
    return {
      ...state,
      state: GS.started,
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

  return state;
};

export const gameReducer = (state: GameState = null, action: AppAction): GameState => {
  if (action.type === 'game/set') {
    return action.payload;
  }

  if (state === null) {
    return state;
  }

  if (action.type === 'rtc/message') {
    return rtcMessageReducer(state, action.payload);
  }

  return state;
};
