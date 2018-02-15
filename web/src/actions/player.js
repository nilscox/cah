import { PLAYER_ROUTE } from '../constants';
import request  from './requestAction';
import { fetchGame } from './game';

export const PLAYER_LOGIN = 'PLAYER_LOGIN';
export function loginPlayer(nick) {
  const opts = {
    method: 'POST',
    route: PLAYER_ROUTE,
    body: { nick },
    expected: [200, 201],
  };

  return dispatch => dispatch(request(PLAYER_LOGIN, opts))
    .then(result => {
      if (result.status) {
        localStorage.setItem('nick', result.body.nick);
        dispatch(fetchGame());
      }
    });
}

export const PLAYER_LOGOUT = 'PLAYER_LOGOUT';
export function logoutPlayer() {
  const opts = {
    method: 'DELETE',
    route: PLAYER_ROUTE,
  };

  return dispatch => dispatch(request(PLAYER_LOGOUT, opts))
    .then(result => {
      if (result.status)
        localStorage.removeItem('nick');
    });
}