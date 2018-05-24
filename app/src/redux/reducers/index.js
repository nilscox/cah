// @flow

import { combineReducers } from 'redux';

import statusReducer from './status';
import gamesReducer from './games';
import playerReducer from './player';
import gameReducer from './game';

export default combineReducers({
  status: statusReducer,
  games: gamesReducer,
  player: playerReducer,
  game: gameReducer,
});
