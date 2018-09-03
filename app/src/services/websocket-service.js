import EventEmitter from 'events';
import io from 'socket.io-client';

const WS_URL = process.env.REACT_APP_WEBSOCKET_URL;

class WSEmitter extends EventEmitter {}

export const emitter = new WSEmitter();

export const createWebSocket = () => {
  const socket = io(WS_URL);

  socket.on('connect', () => console.log('[WS]', 'connect'));
  socket.on('disconnect', () => console.log('[WS]', 'disconnect'));

  socket.on('message', (e) => {
    console.log('[WS]', 'message', e);

    switch (e.type) {
    case 'PLAYER_UPDATE':
      emitter.emit('player:update', e.player);
      break;

    case 'CARDS_DEALT':
      emitter.emit('player:cards', e.cards);
      break;

    case 'GAME_ANSWER':
      emitter.emit('game:answer', e.player);
      break;

    case 'GAME_UPDATE':
    case 'GAME_JOIN':
    case 'GAME_LEAVE':
    case 'GAME_START':
    case 'GAME_ALL_ANSWERS':
    case 'GAME_SELECT':
    case 'GAME_NEXT':
    case 'GAME_END':
      emitter.emit('game:update', e.game);
      break;

    case 'GAME_TURN':
      emitter.emit('game:turn', e.turn);
      break;

    default:
      break;
    }
  });

  return socket;
};
