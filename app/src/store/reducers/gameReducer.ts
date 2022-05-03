import { Game, StartedGame } from '../../domain/entities/game';
import { AppAction, Nullable } from '../types';

export type GameState = Nullable<Game | StartedGame>;

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

  return state;
};
