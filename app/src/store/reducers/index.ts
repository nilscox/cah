import { combineReducers } from 'redux';

import { appStateReducer } from './appStateReducer';
import { gameReducer } from './gameReducer';
import { playerReducer } from './playerReducer';

export const rootReducer = combineReducers({
  player: playerReducer,
  game: gameReducer,
  app: appStateReducer,
});
