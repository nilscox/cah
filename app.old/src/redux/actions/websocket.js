import io from 'socket.io-client';

import { checkApiStatus } from './status';

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

export const WEBSOCKET_EVENT = 'WEBSOCKET_EVENT';
const wsEvent = (socket, event) => ({
  type: WEBSOCKET_EVENT,
  socket,
  event,
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

export const createWebSocket = () => (dispatch) => new Promise((resolve) => {
  socket = io(WEBSOCKET_URL);

  dispatch(wsCreate(socket));

  socket.on('connection', (evt) => dispatch(wsOpen(socket, evt)));
  socket.on('error', (evt) => dispatch(wsError(socket, evt)));
  socket.on('message', (evt) => dispatch(wsEvent(socket, evt)));
  socket.on('disconnect', (evt) => dispatch(wsClose(socket, evt)));

  resolve(socket);
});

export const sendWebSocket = (message) => {
  if (!socket)
    throw new Error('websocket not connected');

  return wsSend(socket, message);
};
