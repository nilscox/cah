import { AppAction, Nullable } from '../types';

export type PlayerState = Nullable<{
  id: string;
  nick: string;
  gameId?: string;
  connected: boolean;
}>;

export const playerReducer = (state: PlayerState = null, action: AppAction): PlayerState => {
  if (action.type === 'player/set') {
    return {
      id: action.payload.id,
      nick: action.payload.nick,
      connected: action.payload.isConnected,
      gameId: action.payload.gameId,
    };
  }

  if (state === null) {
    return state;
  }

  if (action.type === 'player/set-connected') {
    return {
      ...state,
      connected: true,
    };
  }

  return state;
};
