import { Game } from '../../interfaces/entities/Game';
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

export type GameState = Nullable<Game>;

export const gameReducer = (state: GameState = null, action: AppAction): GameState => {
  if (action.type === 'game/set') {
    return action.payload;
  }

  return state;
};

export type AppState = {
  ready: boolean;
};

const defaultAppState: AppState = {
  ready: false,
};

export const appStateReducer = (state = defaultAppState, action: AppAction): AppState => {
  if (action.type === 'app/ready') {
    return { ready: true };
  }

  return state;
};
