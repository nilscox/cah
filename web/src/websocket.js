import {
  websocketConnected,
  websocketCreated,
  websocketMessage,
  websocketClosed
} from './actions/websocket';

let socket = null;

export function connect(dispatch) {
  socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

  dispatch(websocketCreated());

  socket.onopen = function(e) {
    dispatch(websocketConnected(e));
  };

  socket.onmessage = function(event) {
    dispatch(websocketMessage(event, JSON.parse(event.data)));
  };

  socket.onclose = function() {
    dispatch(websocketClosed());
  };
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
