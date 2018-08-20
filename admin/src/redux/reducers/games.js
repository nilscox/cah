import crio from 'crio';
import { handle } from 'redux-pack';

import {
  GAMES_LIST,
} from '../actions';

export default (state = crio({}), action) => {
  const { type, payload } = action;
  const gameId = action.game && action.game.id;
  const extractPlayersNicks = game => game.set('players', game.players.map(p => p.nick));

  const handlers = {
    [GAMES_LIST]: {
      success : () => crio(payload.reduce((o, g) => {
        g.players = g.players.map(p => p.nick);
        o[g.id] = g;
        return o;
      }, {})),
    },
  };

  switch (action.type) {
  case 'WS_GAME_CREATE':
    return state.set(gameId, extractPlayersNicks(crio(action.game)));

  case 'WS_GAME_JOIN':
    return state.set([gameId, 'players'], state[gameId].players.push(action.player.nick));

  case 'WS_GAME_LEAVE':
    const playerIdx = state[gameId].players.findIndex(p => p === action.player.nick);
    return state.delete([gameId, 'players', playerIdx]);

  case 'WS_GAME_UPDATE':
  case 'WS_GAME_START':
  case 'WS_GAME_ANSWER':
  case 'WS_GAME_SELECT':
  case 'WS_GAME_NEXT':
  case 'WS_GAME_END':
    return state.set(gameId, extractPlayersNicks(crio(action.game)));

  default:
    return handlers[type]
      ? handle(state, action, handlers[type])
      : state;
  }
};
