import request from '../request';
import { initializationStart } from './initialization';
import { close as closeWS, connect as connectWS } from '../websocket';
import { API_STATE, WS_STATE } from '../constants';

export const CHECK_API_STATUS = 'CHECK_API_STATUS';
export function checkApiStatus() {
  return (dispatch, getState) => {
    const onSuccess = () => {
      const { status } = getState();

      if (status.api === API_STATE.DOWN) {
        dispatch(apiUp());
        dispatch(initializationStart());
      }
    };

    const onFailure = () => dispatch(apiDown());

    dispatch({ type: CHECK_API_STATUS });

    return request('GET', '/api/')
      .then(onSuccess, onFailure);
  };
}

export const API_DOWN = 'API_DOWN';
export function apiDown() {
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
export function apiUp() {
  return (dispatch, getState) => {
    const { status, player } = getState();

    if (status.api === API_STATE.DOWN)
      dispatch({ type: API_UP });

    if (status.websocket === WS_STATE.CLOSED && player && player.nick)
      connectWS(dispatch);
  };
}