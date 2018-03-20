// @flow

import type { ThunkAction } from 'Types/actions';
import request from '../request';
import { initialize } from './initialization';
import { close as closeWS } from '../websocket';
import { API_STATE, WS_STATE } from '../constants';

export const CHECK_API_STATUS = 'CHECK_API_STATUS';
export function checkApiStatus(reason?: string): ThunkAction {
  return (dispatch, getState) => {
    const onSuccess = () => {
      const { status } = getState();

      if (status.api === API_STATE.DOWN) {
        dispatch(apiUp());
        dispatch(initialize());
      }
    };

    const onFailure = () => dispatch(apiDown());

    dispatch({ type: CHECK_API_STATUS, reason });

    return request('GET', '/api/')
      .then(onSuccess, onFailure);
  };
}

export const API_DOWN = 'API_DOWN';
export function apiDown(): ThunkAction {
  return (dispatch, getState) => {
    const { status } = getState();

    if (status.websocket === WS_STATE.CONNECTED)
      closeWS();

    if (status.api === API_STATE.UP)
      dispatch({ type: API_DOWN });

    setTimeout(() => dispatch(checkApiStatus()), 5000);
  };
}

export const API_UP = 'API_UP';
export function apiUp(): ThunkAction {
  return (dispatch, getState) => {
    const { status } = getState();

    if (status.api === API_STATE.DOWN)
      dispatch({ type: API_UP });
  };
}
