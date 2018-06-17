import { handle } from 'redux-pack';

import { GAMES_LIST, GAME_FETCH_HISTORY } from '../actions';

export default (state = [], action) => {
  const { type, payload, meta } = action;

  const handlers = {
    [GAMES_LIST]: {
      start   : () => [],
      success : () => payload.map(game => ({ ...game, turns: [] })),
      failure : () => [],
    },
    [GAME_FETCH_HISTORY]: {
      start   : (games) => {
        const { gameId } = meta;

        const idx = games.findIndex(game => game.id === gameId);

        if (idx < 0)
          return games;

        return [
          ...games.slice(0, idx),
          { ...games[idx], turns: [] },
          ...games.slice(idx + 1),
        ];
      },
      success : (games) => {
        const { gameId } = meta;

        const idx = games.findIndex(game => game.id === gameId);

        if (idx < 0)
          return games;

        return [
          ...games.slice(0, idx),
          { ...games[idx], turns: payload },
          ...games.slice(idx + 1),
        ];
      },
    },
  };

  return handlers[type]
    ? handle(state, action, handlers[type])
    : state;
};
