import { combineReducers } from 'redux';

import { appSlice } from '../slices/app/app.slice';
import { gameSlice } from '../slices/game/game.slice';
import { playerSlice } from '../slices/player/player.slice';

export const rootReducer = combineReducers({
  player: playerSlice.reducer,
  game: gameSlice.reducer,
  app: appSlice.reducer,
});
