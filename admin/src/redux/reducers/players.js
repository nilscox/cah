import crio from 'crio';
import { handle } from 'redux-pack';

import { PLAYERS_LIST } from '../actions';

export default (state = crio({}), action) => {
  const { type, payload, player: wsPlayer } = action;

  const handlers = {
    [PLAYERS_LIST]: {
      success : () => crio(payload.reduce((o, player) => {
        o[player.nick] = player;
        return o;
      }, {})),
    },
  };

  switch (type) {
  case 'WS_PLAYER_CREATE':
    return state.set(wsPlayer.nick, crio(wsPlayer));

  case 'WS_PLAYER_DELETE':
    return state.delete(wsPlayer.nick);

  case 'WS_PLAYER_UPDATE':
  case 'WS_PLAYER_CONNECT':
  case 'WS_PLAYER_DISCONNECT':
    return state.set(wsPlayer.nick, crio(wsPlayer));

  default:
    return handlers[type]
      ? handle(state, action, handlers[type])
      : state;
  }
};
