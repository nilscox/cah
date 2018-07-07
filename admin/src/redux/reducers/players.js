import crio from 'crio';
import { handle } from 'redux-pack';

import { PLAYERS_LIST , PLAYER_CREATE, WS_MESSAGE } from '../actions';

const PLAYER_CONNECTED = 'PLAYER_CONNECTED';
const PLAYER_DISCONNECTED = 'PLAYER_DISCONNECTED';
const PLAYER_AVATAR_CHANGED = 'PLAYER_AVATAR_CHANGED';
const CARDS_DEALT = 'CARDS_DEALT';

const findPlayerIdx = (players, message) => {
  if (message.player && message.player.nick)
    return players.findIndex(player => player.nick === message.player.nick);
  else
    return null;
};

const websocket = (state, message) => {
  const playerIdx = findPlayerIdx(state, message);

  switch (message.type) {
  case PLAYER_CONNECTED:
  case PLAYER_DISCONNECTED:
  case PLAYER_AVATAR_CHANGED:
    return state.merge(playerIdx, message.player);

  case CARDS_DEALT:
    return state.merge([playerIdx, 'cards'], message.cards);

  default:
    return state;
  }
};

export default (state = crio([]), action) => {
  const { type, payload } = action;

  if (type === WS_MESSAGE)
    return websocket(state, action.message);

  const handlers = {
    [PLAYERS_LIST]: {
      start   : () => [],
      success : () => crio(payload),
      failure : () => [],
    },
    [PLAYER_CREATE]: {
      success : (prevState) => prevState.push(crio(payload)),
    },
  };

  return handlers[type]
    ? handle(state, action, handlers[type])
    : state;
};
