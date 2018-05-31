import { handle } from 'redux-pack';

import initialState from '../state';
import {
  API_DOWN,
  PLAYER_LOGOUT,
  GAME_FETCH,
  GAME_CREATE,
  GAME_JOIN,
  GAME_FETCH_HISTORY,
} from '../actions';

export default (state = initialState.game, action) => {
  const { type, payload } = action;

  if (action.type === API_DOWN || action.type === PLAYER_LOGOUT)
    return initialState.game;

  const handlers = {
    [GAME_FETCH]: {
      start: () => null,
      success: () => payload,
      failure: () => null,
    },
    [GAME_CREATE]: {
      start: () => null,
      success: () => payload,
      failure: () => null,
    },
    [GAME_JOIN]: {
      start: () => null,
      success: () => payload,
      failure: () => null,
    },
    [GAME_FETCH_HISTORY]: {
      start: prevState => ({ ...prevState, history: null }),
      success: prevState => ({ ...prevState, history: payload }),
      failure: prevState => ({ ...prevState, history: null }),
    },
  };

  return handlers[type]
    ? handle(state, action, handlers[type])
    : state;
}
