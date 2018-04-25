// @flow

import { handle } from 'redux-pack';

import type { Action } from '../types/actions';
import type { Game } from '../types/game';
import { GAME_LIST } from './actions';

export type State = {|
  error: ?Error,
  gamesList: ?Array<Game>,
|};

const initialState: State = {
  error: null,
  gamesList: null,
};

export default function(state: State = initialState, action: Action) {
  const { type, payload } = action;

  const handlers = {
    [GAME_LIST]: {
      start: prevState => ({ ...prevState, error: null }),
      success: prevState => ({ ...prevState, gamesList: payload, error: null }),
      failure: prevState => ({ ...prevState, gamesList: null, error: payload }),
    },
  };

  return handlers[type]
    ? handle(state, action, handlers[type])
    : state;
}
