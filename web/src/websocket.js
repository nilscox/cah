import { wsCreated, wsConnected, wsMessage } from './actions';

let socket = null;

export function connect(dispatch) {
  socket = new WebSocket('ws://localhost:8000/game/');

  dispatch(wsCreated());

  socket.onopen = function(e) {
    dispatch(wsConnected(e));
  };

  socket.onmessage = function(event) {
    dispatch(wsMessage(event, JSON.parse(event.data)));
  };
}

export function send(message) {
  if (!socket)
    throw new Error('socket is not connected');

  socket.send(JSON.stringify(message));
}
