import {
  websocketConnected,
  websocketCreated,
  websocketMessage,
  websocketClosed
} from './actions/websocket';

let socket = null;

export function connect(dispatch) {
  return new Promise((resolve, reject) => {
    let resolved = false;

    socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    dispatch(websocketCreated());

    socket.onopen = function(e) {
      dispatch(websocketConnected(e));

      if (!resolved) {
        resolved = true;
        resolve();
      }
    };

    socket.onmessage = function(event) {
      dispatch(websocketMessage(event, JSON.parse(event.data)));
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

export function close() {
  if (!socket)
    throw new Error('socket is not connected');

  socket.close();
}

export function send(message) {
  if (!socket)
    throw new Error('socket is not connected');

  socket.send(JSON.stringify(message));
}
