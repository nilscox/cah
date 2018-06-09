import { checkApiStatus } from './status';

// $FlowFixMe
const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL;

let socket = null;

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
const wsError = (socket, event) => (dispatch) => {
  dispatch({
    type: WEBSOCKET_ERROR,
    socket,
    event,
  });

  dispatch(checkApiStatus());
};

export const WEBSOCKET_SEND = 'WEBSOCKET_SEND';
const wsSend = (socket, message) => (dispatch) => {
  dispatch({
    type: WEBSOCKET_SEND,
    socket,
    message,
  });

  socket.send(JSON.stringify(message));
};

export const createWebSocket = () => (dispatch) => new Promise((resolve, reject) => {
  socket = new WebSocket(WEBSOCKET_URL);

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

export const sendWebSocket = (message) => {
  if (!socket)
    throw new Error('websocket not connected');

  return wsSend(socket, message);
};
