// @flow

import { createWebSocket } from './websocket';

const connectWebSocket = (dispatch, { player }) => {
  if (!player)
    return;

  dispatch(createWebSocket())
    .then((socket) => {
      socket.send(JSON.stringify({
        action: 'connected',
        nick: player.nick,
      }));
    });
}

export const PLAYER_FETCH = 'PLAYER_FETCH';
export const fetchPlayer = () => (dispatch, getState) => dispatch({
  type: PLAYER_FETCH,
  route: '/api/player',
  meta: {
    onSuccess: () => connectWebSocket(dispatch, getState()),
  },
});

export const PLAYER_LOGIN = 'PLAYER_LOGIN';
export const loginPlayer = (nick: string) => (dispatch, getState) => dispatch({
  type: PLAYER_LOGIN,
  route: '/api/player',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nick }),
  meta: {
    onSuccess: () => connectWebSocket(dispatch, getState()),
  },
});
