import { fetchGame } from './game';
import { createWebSocket } from './websocket';

const onPlayerFetched = (dispatch, getState) => {
  const { player } = getState();

  if (!player)
    return;

  return Promise.resolve()
    .then(() => dispatch(createWebSocket()))
    .then((socket) => {
      // expose the socket in the console
      global.socket = socket;

      socket.send(JSON.stringify({
        action: 'connected',
        nick: player.nick,
      }));
    })
    .then(() => dispatch(fetchGame()));
};

export const PLAYER_FETCH = 'PLAYER_FETCH';
export const fetchPlayer = () => ({
  type: PLAYER_FETCH,
  route: '/api/player',
  after: ({ dispatch, getState }) => onPlayerFetched(dispatch, getState),
});

export const PLAYER_LOGIN = 'PLAYER_LOGIN';
export const loginPlayer = (nick) => ({
  type: PLAYER_LOGIN,
  route: '/api/player',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nick }),
  after: ({ dispatch, getState }) => onPlayerFetched(dispatch, getState),
});

export const PLAYER_LOGOUT = 'PLAYER_LOGOUT';
export const logoutPlayer = () => ({
  type: PLAYER_LOGOUT,
  route: '/api/player',
  method: 'DELETE',
});

export const PLAYER_UPDATE = 'PLAYER_UPDATE';
export const updatePlayer = (player) => ({
  type: PLAYER_UPDATE,
  route: '/api/player',
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(player),
});
