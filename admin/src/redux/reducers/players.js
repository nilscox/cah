import { handle } from 'redux-pack';

import { PLAYERS_LIST , PLAYER_CREATE, WS_MESSAGE } from '../actions';

const PLAYER_CONNECTED = 'PLAYER_CONNECTED';
const PLAYER_DISCONNECTED = 'PLAYER_DISCONNECTED';

const replace = (arr, idx, value) => {
  return [
    ...arr.slice(0, idx),
    value,
    ...arr.slice(idx + 1),
  ];
};

const findPlayerIdx = (players, nick) => players.findIndex(player => player.nick === nick);

const setPlayerConnected = (player, connected) => ({
  ...player,
  connected,
});

const websocket = (state, message) => {
  if (message.type === PLAYER_CONNECTED) {
    const idx = findPlayerIdx(state, message.player.nick);

    return replace(state, idx, setPlayerConnected(state[idx], true));
  }

  if (message.type === PLAYER_DISCONNECTED) {
    const idx = findPlayerIdx(state, message.nick);

    return replace(state, idx, setPlayerConnected(state[idx], false));
  }

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
      success : () => [ ...state, payload ],
    },
  };

  return handlers[type]
    ? handle(state, action, handlers[type])
    : state;
};
