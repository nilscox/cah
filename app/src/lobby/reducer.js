// @flow

import { handle } from 'redux-pack';

import type { Action } from '../types/actions';
import type { Game } from '../types/game';
import { GAME_LIST } from './actions';

export type LobbyState = {|
  loading: boolean,
  gamesList: ?Array<Game>,
|};

const initialState: LobbyState = {
  loading: false,
  gamesList: null,
};

export default function(state: LobbyState = initialState, action: Action) {
  const handlers = {
    GAME_LIST: {
      success: prevState => ({ ...prevState, gamesList: action.payload && action.payload.body }),
    },
  };

  const handler = handlers[action.type];

  if (handler)
    return handle(state, action, handler);

  return state;
}
