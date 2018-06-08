import { handle } from 'redux-pack';

import initialState from '../state';
import {
  API_DOWN,
  PLAYER_LOGOUT,
  PLAYER_FETCH, PLAYER_LOGIN,
} from '../actions';

export default (state = initialState.player, action) => {
  const { type, payload } = action;

  if (action.type === API_DOWN || action.type === PLAYER_LOGOUT)
    return initialState.player;

  const handlers = {
    [PLAYER_FETCH]: {
      start: () => null,
      success: () => ({ ...payload, selectedChoices: [] }),
      failure: () => null,
    },
    [PLAYER_LOGIN]: {
      start: () => null,
      success: () => ({ ...payload, selectedChoices: [] }),
      failure: () => null,
    },
  };

  return handlers[type]
    ? handle(state, action, handlers[type])
    : state;
}
