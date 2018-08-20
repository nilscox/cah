import { combineReducers } from 'redux';

import status from './status';
import games from './games';
import histories from './histories';
import players from './players';

export default combineReducers({
  status,
  games,
  histories,
  players,
});
