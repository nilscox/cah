// @flow

import { handle } from 'redux-pack';

import type { Player } from '~/types/player';
import { PLAYER_FETCH, PLAYER_LOGIN } from '~/redux/actions';

export type State = {
  player: ?Player,
};

const initialValue = {
  error: null,
  player: null,
};

export default (state: State = initialValue, action: any): State => {
  const { type, payload } = action;

  const handlers = {
    [PLAYER_FETCH]: {
      start: prevState => ({ ...prevState, error: null }),
      success: prevState => ({ ...prevState, player: payload }),
      failure: prevState => ({ ...prevState, player: null, error: payload }),
    },
    [PLAYER_LOGIN]: {
      start: prevState => ({ ...prevState, error: null }),
      success: prevState => ({ ...prevState, player: payload }),
      failure: prevState => ({ ...prevState, player: null, error: payload }),
    },
  };

  return handlers[type]
    ? handle(state, action, handlers[type])
    : state;
}
