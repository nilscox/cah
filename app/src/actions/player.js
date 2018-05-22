// @flow

import { player } from './api';
import type { Action } from '~/types/actions';

export const PLAYER_FETCH = 'PLAYER_FETCH';
export const fetchPlayer = (): Action => ({
  type: PLAYER_FETCH,
  promise: player.fetch(),
});

export const PLAYER_LOGIN = 'PLAYER_LOGIN';
export const loginPlayer = (nick: string): Action => ({
  type: PLAYER_LOGIN,
  promise: player.login(nick),
});

export const WS_OPEN = 'WS_OPEN';
export const wsOpen = (): Action => ({
  type: WS_OPEN,
});

export const WS_MESSAGE = 'WS_MESSAGE';
export const wsMessage = (event: any): Action => ({
  type: WS_MESSAGE,
  event,
});

export const WS_ERROR = 'WS_ERROR';
export const wsError = (error: any): Action => ({
  type: WS_ERROR,
  error,
});

export const WS_CLOSE = 'WS_CLOSE';
export const wsClose = (event: any): Action => ({
  type: WS_CLOSE,
  event,
});
