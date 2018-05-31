import { createWebSocket } from './websocket';

export const PLAYER_FETCH = 'PLAYER_FETCH';
export const fetchPlayer = () => ({
  type: PLAYER_FETCH,
  route: '/api/player',
});

export const PLAYER_LOGIN = 'PLAYER_LOGIN';
export const loginPlayer = (nick) => (dispatch, getState) => dispatch({
  type: PLAYER_LOGIN,
  route: '/api/player',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nick }),
  meta: {
    onSuccess: () => {
      const { player } = getState();

      dispatch(createWebSocket())
        .then((socket) => {
          socket.send(JSON.stringify({
            action: 'connected',
            nick: player.nick,
          }));
        });
    },
  },
});

export const PLAYER_LOGOUT = 'PLAYER_LOGOUT';
export const logoutPlayer = () => ({
  type: PLAYER_LOGOUT,
  route: '/api/player',
  method: 'DELETE',
});
