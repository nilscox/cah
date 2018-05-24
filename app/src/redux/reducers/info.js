// @flow

import { handle } from 'redux-pack';

import type { Info } from '../state/info';

import { PLAYER_FETCH, PLAYER_LOGIN } from '../actions';

import initialState from '../state';

export type State = {
  info: ?Info,
};

export default (state: State = initialState.info, action: any): State => {
  const { type, payload } = action;

  const handlers = {
    ['GAMES_LIST']: {
      start: prevState => ({ ...prevState, gamesList: null }),
      success: prevState => ({ ...prevState, gamesList: payload }),
      failure: prevState => ({ ...prevState, gamesList: null }),
    },
    ['GAME_JOIN']: {
      start: prevState => ({ ...prevState, currentGame: null }),
      success: prevState => ({ ...prevState, currentGame: payload }),
      failure: prevState => ({ ...prevState, currentGame: null }),
    },
  };

  return handlers[type]
    ? handle(state, action, handlers[type])
    : state;
}
