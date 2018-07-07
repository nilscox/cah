// @flow

import type { Dispatch } from 'Types/actions';
import {
  websocketConnected,
  websocketCreated,
  websocketMessage,
  websocketClosed
} from 'Actions/websocket';

// $FlowFixMe
const WEBSOCKET_URL: string = process.env.REACT_APP_CAH_WEBSOCKET_URL;
console.log(process.env.REACT_APP_CAH_WEBSOCKET_URL);

let socket = null;

export function connect(dispatch: Dispatch): Promise<void> {
  return new Promise((resolve, reject) => {
    let resolved = false;

    socket = new WebSocket(WEBSOCKET_URL);

    dispatch(websocketCreated());

    socket.onopen = function(e: any) {
      dispatch(websocketConnected(e));

      if (!resolved) {
        resolved = true;
        resolve();
      }
    };

    socket.onmessage = function(e: any) {
      dispatch(websocketMessage(e, JSON.parse(e.data)));
    };

    socket.onclose = function() {
      dispatch(websocketClosed());
    };

    socket.onerror = function() {
      if (!resolved) {
        resolved = true;
        reject();
      }
    };
  });
}

export function close(): void {
  if (!socket)
    throw new Error('socket is not connected');

  socket.close();
}

export function send(message: any): void {
  if (!socket)
    throw new Error('socket is not connected');

  socket.send(JSON.stringify(message));
}
