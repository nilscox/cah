let socket = null;

export default function(dispatch) {
  socket = new WebSocket('ws://localhost:8000/game/');

  dispatch({
    type: 'WS_CREATED',
  });

  socket.onopen = function(e) {
    dispatch({
      type: 'WS_CONNECTED',
    });
  };

  socket.onmessage = function(e) {
    dispatch({
      type: 'WS_MESSAGE',
      message: JSON.parse(e.data),
    });
  };
}

export function send(message) {
  if (!socket)
    throw new Error('socket is not connected');

  socket.send(JSON.stringify(message));
}
