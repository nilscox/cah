import {send as sendToWS} from '../websocket';
import { checkApiStatus } from './apiState';

export const WEBSOCKET_CREATED = 'WEBSOCKET_CREATED';
export function websocketCreated() {
  return {
    type: WEBSOCKET_CREATED,
  };
}

export const WEBSOCKET_CONNECTED = 'WEBSOCKET_CONNECTED';
export function websocketConnected(event) {
  return (dispatch, getState) => {
    const { player }= getState();

    sendToWS({
      action: 'connected',
      nick: player.nick,
    });

    dispatch({
      type: WEBSOCKET_CONNECTED,
      event,
    });
  };
}

export const WEBSOCKET_MESSAGE_PREFIX = 'WS_';
export function websocketMessage(event, message) {
  if (!message.type)
    throw new Error('No action in message: ' + message);

  return dispatch => {
    dispatch({
      type: WEBSOCKET_MESSAGE_PREFIX + message.type,
      message,
    });
  };
}

export const WEBSOCKET_CLOSED = 'WEBSOCKET_CLOSED';
export function websocketClosed() {
  return dispatch => {
    dispatch({
      type: WEBSOCKET_CLOSED,
    });

    dispatch(checkApiStatus());
  };
}
