import { handle } from 'redux-pack';

import {
  GAMES_LIST,
  GAME_FETCH_HISTORY,
  GAME_CREATE,
  WS_MESSAGE,
} from '../actions';

const findGame = (games, gameId) => games.find(game => game === gameId);

export default (state = [], action) => {
  const { type, payload, meta } = action;
  const findGame = (games, id) => games.findIndex(g => g.id === id);

  const handlers = {
    [GAMES_LIST]: {
      start   : () => [],
      success : () => payload.map(game => ({ ...game, turns: [] })),
      failure : () => [],
    },
    [GAME_FETCH_HISTORY]: {
      start   : (games) => games,
      success : (games) => games,
    },
    [GAME_CREATE]: {
      success : () => [ ...state, { ...payload, turns: [] } ],
    },
  };

  return handlers[type]
    ? handle(state, action, handlers[type])
    : state;
};
