import selectors from '~/redux/selectors'

import { fetchGame } from './game';
import { createWebSocket } from './websocket';

const onPlayerFetched = ({ dispatch, getState }) => {
  const { player } = getState();

  if (!player)
    return;

  return Promise.resolve()
    .then(() => dispatch(createWebSocket()))
    .then((socket) => {
      // expose the socket in the console
      global.socket = socket;
    })
    .then(() => {
      if (player.gameId)
        return dispatch(fetchGame(player.gameId));
    });
};

export const PLAYER_FETCH = 'PLAYER_FETCH';
export const fetchPlayer = () => ({
  type: PLAYER_FETCH,
  route: '/api/player/me',
  after: onPlayerFetched,
});

export const PLAYER_LOGIN = 'PLAYER_LOGIN';
export const loginPlayer = (nick) => ({
  type: PLAYER_LOGIN,
  route: '/api/player/login',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nick }),
  after: onPlayerFetched,
});

export const PLAYER_LOGOUT = 'PLAYER_LOGOUT';
export const logoutPlayer = () => (dispatch, getState) => {
  const player = selectors.player(getState());

  dispatch({
    type: PLAYER_LOGOUT,
    route: `/api/player/${player.id}/logout`,
    method: 'POST',
  });
};

export const PLAYER_UPDATE = 'PLAYER_UPDATE';
export const updatePlayer = (data) => (dispatch, getState) => {
  const player = selectors.player(getState());

  return {
    type: PLAYER_UPDATE,
    route: `/api/player/${player.id}`,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  };
};
