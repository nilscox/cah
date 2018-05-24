// @flow

import { handle } from 'redux-pack';

import type { Game } from '~/redux/types/game';
import { GAME_FETCH } from '~/redux/actions';

export type State = {
  error: ?Error,
  game: ?Game,
};

const initialValue = {
  error: null,
  game: null,
};

export default (state: State = initialValue, action: any): State => {
  const { type, payload } = action;

  const handlers = {
    [GAME_FETCH]: {
      start: prevState => ({ ...prevState, error: null }),
      success: prevState => ({ ...prevState, game: payload, error: null }),
      failure: prevState => ({ ...prevState, game: null, error: payload }),
    },
  };

  return handlers[type]
    ? handle(state, action, handlers[type])
    : state;
}
