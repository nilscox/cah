// @flow

import { handle } from 'redux-pack';

import type { Game } from '../state/game';
import { GAMES_LIST } from '../actions';
import initialState from '../state';

export type State = {
  error: ?Error,
  game: ?Game,
};

export default (state: State = initialState.game, action: any): State => {
  const { type, payload } = action;

  if (action.type === 'API_DOWN')
    return initialState.games;

  const handlers = {
    [GAMES_LIST]: {
      start: prevState => [],
      success: prevState => payload,
      failure: prevState => [],
    },
  };

  return handlers[type]
    ? handle(state, action, handlers[type])
    : state;
}
