// @flow

import { player } from './api';

export const PLAYER_FETCH = 'PLAYER_FETCH';
export const fetchPlayer = () => ({
  type: PLAYER_FETCH,
  promise: player.fetch(),
});

export const PLAYER_LOGIN = 'PLAYER_LOGIN';
export const loginPlayer = (nick: string) => ({
  type: PLAYER_LOGIN,
  promise: player.login(nick),
});

export const WS_OPEN = 'WS_OPEN';
export const wsOpen = () => ({
  type: WS_OPEN,
});

export const WS_MESSAGE = 'WS_MESSAGE';
export const wsMessage = (event: any) => ({
  type: WS_MESSAGE,
  event,
});

export const WS_ERROR = 'WS_ERROR';
export const wsError = (error: any) => ({
  type: WS_ERROR,
  error,
});

export const WS_CLOSE = 'WS_CLOSE';
export const wsClose = (event: any) => ({
  type: WS_CLOSE,
  event,
});
