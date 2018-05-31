import { handle } from 'redux-pack';

import initialState from '../state';
import {
  API_DOWN,
  PLAYER_LOGOUT,
  GAMES_LIST,
} from '../actions';

export default (state = initialState.game, action) => {
  const { type, payload } = action;

  if (action.type === API_DOWN || action.type === PLAYER_LOGOUT)
    return initialState.games;

  const handlers = {
    [GAMES_LIST]: {
      start: () => [],
      success: () => payload,
      failure: () => [],
    },
  };

  return handlers[type]
    ? handle(state, action, handlers[type])
    : state;
}
