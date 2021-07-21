import { AppAction, Nullable } from '../types';

export type PlayerState = Nullable<{
  id: string;
  nick: string;
  gameId?: string;
  isConnected: boolean;
}>;

export const playerReducer = (state: PlayerState = null, action: AppAction): PlayerState => {
  if (action.type === 'player/set') {
    return action.payload;
  }

  if (state === null) {
    return state;
  }

  if (action.type === 'player/set-connected') {
    return {
      ...state,
      isConnected: true,
    };
  }

  return state;
};
