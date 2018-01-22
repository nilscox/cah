import { PLAYER_ROUTE } from '../constants';
import request from './requestAction';
import { fetchGame, fetchGameHistory } from './game';

export const PLAYER_FETCH = 'PLAYER_FETCH';
export function fetchPlayer() {
  return request(PLAYER_FETCH, {
    method: 'GET',
    route: PLAYER_ROUTE,
    expected: [200, 404],
  });
}

export const INITIALIZATION_STARTED = 'INITIALIZATION_STARTED';
export function initializationStart() {
  const delay = d => new Promise(r => setTimeout(r, d));

  return dispatch => {
    dispatch({ type: INITIALIZATION_STARTED });

    dispatch(fetchPlayer())
      .then(result => {
        if (result.status === 200)
          return delay(500).then(() => dispatch(fetchGame()));
      })
      .then(result => {
        if (result && result.status === 200)
          return dispatch(fetchGameHistory());
      })
      .then(() => dispatch(initializationFinished()));
  };
}

export const INITIALIZATION_FINISHED = 'INITIALIZATION_FINISHED';
export function initializationFinished() {
  return {
    type: INITIALIZATION_FINISHED,
  };
}
