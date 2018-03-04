// @flow

import type { Dispatch, ThunkAction } from 'Types/actions';
import { PLAYER_ROUTE } from '../constants';
import request from './requestAction';
import { fetchGame } from './game';
import {connect as connectWS} from '../websocket';

const onPlayerFetch = (dispatch: Dispatch, result: any): Promise<any> => {
  let promise = Promise.resolve();

  if (result && result.status !== 404) {
    promise = promise.then(() => connectWS(dispatch));
    promise = promise.then(() => dispatch(fetchGame()));
  }

  return promise;
};

export const PLAYER_FETCH = 'PLAYER_FETCH';
export function fetchPlayer(): ThunkAction {
  const opts = {
    method: 'GET',
    route: PLAYER_ROUTE,
    expected: [200, 404],
  };

  return dispatch => dispatch(request(PLAYER_FETCH, opts))
    .then(onPlayerFetch.bind(null, dispatch));
}

export const PLAYER_LOGIN = 'PLAYER_LOGIN';
export function loginPlayer(nick: string): ThunkAction {
  const opts = {
    method: 'POST',
    route: PLAYER_ROUTE,
    body: { nick },
    expected: [200, 201],
  };

  return dispatch => dispatch(request(PLAYER_LOGIN, opts))
    .then(onPlayerFetch.bind(null, dispatch));
}

export const PLAYER_LOGOUT = 'PLAYER_LOGOUT';
export function logoutPlayer(): ThunkAction {
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

export const CHANGE_PLAYER_AVATAR = 'CHANGE_PLAYER_AVATAR';
export function changePlayerAvatar(file: File): ThunkAction {
  const opts = {
    method: 'POST',
    route: PLAYER_ROUTE + '/avatar',
    files: {
      avatar: file,
    },
  };

  return request(CHANGE_PLAYER_AVATAR, opts);
}
