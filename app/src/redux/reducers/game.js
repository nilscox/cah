// @flow

import { handle } from 'redux-pack';

import type { Game } from '../state/game';
import { GAME_FETCH, GAME_JOIN } from '../actions';
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
  };

  return handlers[type]
    ? handle(state, action, handlers[type])
    : state;
}
