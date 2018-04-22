// @flow

import { handle } from 'redux-pack';

import type { Action } from '../types/actions';
import type { Player } from '../types/player';
import { PLAYER_LOGIN } from './actions';

export type AuthState = ?{
  player: Player,
};

export default function(state: AuthState = null, action: Action) {
  const handlers = {
    PLAYER_LOGIN: {
      success: prevState => ({ ...prevState, player: action.payload && action.payload.body }),
    },
  };

  const handler = handlers[action.type];

  if (handler)
    return handle(state, action, handler);

  return state;
}
