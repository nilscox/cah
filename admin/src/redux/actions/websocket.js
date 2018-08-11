import io from 'socket.io-client';

const WS_URL = process.env.REACT_APP_WEBSOCKET_URL;

let socket = null;

export const WS_OPEN = 'WS_OPEN';
export const WS_CLOSE = 'WS_CLOSE';
export const WS_MESSAGE = 'WS_MESSAGE';
export const WS_ERROR = 'WS_ERROR';

export const createWebsocket = () => (dispatch) => {
  socket = io(WS_URL);

  socket.addEventListener('open',
    (event) => dispatch({ type: WS_OPEN, event })
  );

  socket.addEventListener('close',
    (event) => dispatch({ type: WS_CLOSE, event })
  );

  socket.addEventListener('message',
    (event) => dispatch({ type: 'WS_' + event.type, message: JSON.parse(event) })
  );

  socket.addEventListener('error',
    (event) => dispatch({ type: WS_ERROR, event })
  );
};
