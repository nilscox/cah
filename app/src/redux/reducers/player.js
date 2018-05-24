// @flow

import { handle } from 'redux-pack';

import type { Player } from '../state/player';

import { PLAYER_FETCH, PLAYER_LOGIN } from '../actions';

import initialState from '../state';

export type State = {
  player: ?Player,
};

export default (state: State = initialState.player, action: any): State => {
  const { type, payload } = action;

  const handlers = {
    [PLAYER_FETCH]: {
      start: prevState => null,
      success: prevState => payload,
      failure: prevState => null,
    },
    [PLAYER_LOGIN]: {
      start: prevState => null,
      success: prevState => payload,
      failure: prevState => null,
    },
  };

  return handlers[type]
    ? handle(state, action, handlers[type])
    : state;
}
