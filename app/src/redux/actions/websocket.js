export const WEBSOCKET_CREATE = 'WEBSOCKET_CREATE';
const wsCreate = (socket) => ({
  type: WEBSOCKET_CREATE,
  socket,
});

export const WEBSOCKET_OPEN = 'WEBSOCKET_OPEN';
const wsOpen = (socket) => ({
  type: WEBSOCKET_OPEN,
  socket,
});

export const WEBSOCKET_MESSAGE = 'WEBSOCKET_MESSAGE';
const wsMessage = (socket, event) => ({
  type: WEBSOCKET_MESSAGE,
  socket,
  event,
  message: JSON.parse(event.data),
});

export const WEBSOCKET_CLOSE = 'WEBSOCKET_CLOSE';
const wsClose = (socket, event) => ({
  type: WEBSOCKET_CLOSE,
  socket,
  event,
});

export const WEBSOCKET_ERROR = 'WEBSOCKET_ERROR';
const wsError = (socket, event) => ({
  type: WEBSOCKET_ERROR,
  socket,
  event,
});

export const createWebSocket = () => (dispatch) => new Promise((resolve, reject) => {
  const socket = new WebSocket('ws://192.168.0.18:8000');

  dispatch(wsCreate(socket));

  socket.onopen = () => {
    dispatch(wsOpen(socket));

    if (resolve) {
      resolve(socket);
      resolve = reject = null;
    }
  };

  socket.onerror = (evt) => {
    dispatch(wsError(socket, evt));

    if (reject) {
      reject(evt);
      resolve = reject = null;
    }
  };

  socket.onmessage = (evt) => dispatch(wsMessage(socket, evt));
  socket.onclose = (evt) => dispatch(wsClose(socket, evt));
});
