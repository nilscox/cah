import io from 'socket.io-client';

// eslint-disable-next-line no-undef
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
    (event) => dispatch({ ...event, type: 'WS_' + event.type })
  );

  socket.addEventListener('error',
    (event) => dispatch({ type: WS_ERROR, event })
  );
};
