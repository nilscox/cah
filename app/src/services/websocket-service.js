import EventEmitter from 'events';
import io from 'socket.io-client';

const WS_URL = process.env.REACT_APP_WEBSOCKET_URL;

class WSEmitter extends EventEmitter {}

export const emitter = new WSEmitter();

export const createWebSocket = () => {
  const socket = io(WS_URL);

  socket.on('connect', () => console.log('ws:connect'));
  socket.on('disconnect', () => console.log('ws:disconnect'));

  socket.on('message', (e) => {
    console.log('ws:message', e);

    switch (e.type) {
    case 'PLAYER_UPDATE':
    case 'CARDS_DEALT':
      emitter.emit('player:update', e.player);

    case 'GAME_UPDATE':
    case 'GAME_JOIN':
    case 'GAME_LEAVE':
    case 'GAME_START':
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
