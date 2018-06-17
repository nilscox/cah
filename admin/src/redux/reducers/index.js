import { combineReducers } from 'redux';

import games from './games';
import players from './players';

export default combineReducers({
  games,
  players,
});
