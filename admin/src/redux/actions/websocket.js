const WS_URL = process.env.REACT_APP_CAH_WEBSOCKET_URL;
const API_ADMIN_TOKEN = process.env.REACT_APP_CAH_API_ADMIN_TOKEN;

let socket = null;

export const WS_OPEN = 'WS_OPEN';
export const WS_CLOSE = 'WS_CLOSE';
export const WS_MESSAGE = 'WS_MESSAGE';
export const WS_ERROR = 'WS_ERROR';

export const createWebsocket = () => (dispatch) => {
  socket = new WebSocket(WS_URL);

  socket.addEventListener('open',
    (event) => {
      socket.send(JSON.stringify({
        action: 'admin',
        token: API_ADMIN_TOKEN,
      }));

      dispatch({ type: WS_OPEN, event })
    }
  );

  socket.addEventListener('close',
    (event) => dispatch({ type: WS_CLOSE, event })
  );

  socket.addEventListener('message',
    (event) => dispatch({ type: WS_MESSAGE, message: JSON.parse(event.data) })
  );

  socket.addEventListener('error',
    (event) => dispatch({ type: WS_ERROR, event })
  );
};
