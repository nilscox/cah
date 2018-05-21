// @flow

import { handle } from 'redux-pack';

import type { Action } from '~/types/actions';
import type { Game } from '~/types/game';
import { GAMES_LIST, GAME_FETCH, GAME_JOIN } from './actions';

export type State = {|
  error: ?Error,
  gamesList: ?Array<Game>,
  currentGame: ?Game,
|};

const initialState: State = {
  error: null,
  gamesList: null,
  currentGame: null,
};

export default function(state: State = initialState, action: Action) {
  const { type, payload } = action;

  const handlers = {
    [GAMES_LIST]: {
      start: prevState => ({ ...prevState, error: null }),
      success: prevState => ({ ...prevState, gamesList: payload, error: null }),
      failure: prevState => ({ ...prevState, gamesList: null, error: payload }),
    },
    [GAME_FETCH]: {
      start: prevState => ({ ...prevState, error: null }),
      success: prevState => ({ ...prevState, currentGame: payload, error: null }),
      failure: prevState => ({ ...prevState, currentGame: null, error: payload }),
    },
    [GAME_JOIN]: {
      start: prevState => ({ ...prevState, error: null }),
      success: prevState => ({ ...prevState, currentGame: payload, error: null }),
      failure: prevState => ({ ...prevState, currentGame: null, error: payload }),
    },
  };

  return handlers[type]
    ? handle(state, action, handlers[type])
    : state;
}
