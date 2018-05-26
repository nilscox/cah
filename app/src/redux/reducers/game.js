// @flow

import { handle } from 'redux-pack';

import type { Game } from '../state/game';
import { GAME_FETCH, GAME_JOIN, GAME_FETCH_HISTORY } from '../actions';
import initialState from '../state';

export type State = {
  error: ?Error,
  game: ?Game,
};

export default (state: State = initialState.game, action: any): State => {
  const { type, payload } = action;

  const handlers = {
    [GAME_FETCH]: {
      start: prevState => null,
      success: prevState => payload,
      failure: prevState => null,
    },
    [GAME_JOIN]: {
      start: prevState => null,
      success: prevState => payload,
      failure: prevState => null,
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
