import { handle } from 'redux-pack';

import { PLAYERS_LIST , PLAYER_CREATE, WS_MESSAGE } from '../actions';

const crio = window.crio.default;

const PLAYER_CONNECTED = 'PLAYER_CONNECTED';
const PLAYER_DISCONNECTED = 'PLAYER_DISCONNECTED';

const isPlayer = nick => player => player.nick === nick;

const websocket = (state, message) => {
  if (message.type === PLAYER_CONNECTED)
    return crio(state).set([state.findIndex(isPlayer(message.player.nick)), 'connected'], true);

  if (message.type === PLAYER_DISCONNECTED)
    return crio(state).set([state.findIndex(isPlayer(message.nick)), 'connected'], false);

  return state;
};

export default (state = [], action) => {
  const { type, payload } = action;

  if (type === WS_MESSAGE)
    return websocket(state, action.message);

  const handlers = {
    [PLAYERS_LIST]: {
      start   : () => [],
      success : () => payload,
      failure : () => [],
    },
    [PLAYER_CREATE]: {
      success : (prevState) => crio(prevState).push(payload),
    },
  };

  return handlers[type]
    ? handle(state, action, handlers[type])
    : state;
};
