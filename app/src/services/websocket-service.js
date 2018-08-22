import EventEmitter from 'events';
import io from 'socket.io-client';

const WS_URL = process.env.REACT_APP_WEBSOCKET_URL;

class WSEmitter extends EventEmitter {}

export const emitter = new WSEmitter();

export const createWebSocket = () => {
  const socket = io(WS_URL);
  console.log(WS_URL);

  socket.on('connect', () => console.log('ws:connect'));
  socket.on('disconnect', () => console.log('ws:connect'));

  socket.on('message', (e) => {
    switch (e.type) {
    case 'GAME_ANSWER':
    case 'GAME_SELECT':
    case 'GAME_NEXT':
    case 'GAME_END':
      emitter.emit('game:update', e.game);
      break;

    default:
      break;
    }
  });
};
