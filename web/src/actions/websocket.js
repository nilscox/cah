// @flow

import type { ThunkAction } from '../types/actions';
import type { WebsocketCreatedAction, WebsocketMessageAction } from '../types/actions';
import type { WSMessage } from '../types/websocket';
import {send as sendToWS} from '../websocket';
import { checkApiStatus } from './apiState';

export const WEBSOCKET_CREATED = 'WEBSOCKET_CREATED';
export function websocketCreated(): WebsocketCreatedAction {
  return {
    type: WEBSOCKET_CREATED,
  };
}

export const WEBSOCKET_CONNECTED = 'WEBSOCKET_CONNECTED';
export function websocketConnected(event: any): ThunkAction {
  return (dispatch, getState) => {
    const { player } = getState();

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

export const WEBSOCKET_MESSAGE = 'WEBSOCKET_MESSAGE';
export function websocketMessage(event: any, message: WSMessage): WebsocketMessageAction {
  if (!message.type)
    throw new Error('No action in message: ' + message);

  return {
    type: WEBSOCKET_MESSAGE,
    message,
  };
}

export const WEBSOCKET_CLOSED = 'WEBSOCKET_CLOSED';
export function websocketClosed(): ThunkAction {
  return dispatch => {
    dispatch({
      type: WEBSOCKET_CLOSED,
    });

    dispatch(checkApiStatus('WEBSOCKET_DISCONNECTED'));
  };
}
