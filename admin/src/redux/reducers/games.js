import { handle } from 'redux-pack';

import { GAMES_LIST } from '../actions';

export default (state = [], action) => {
  const { type, payload } = action;

  const handlers = {
    [GAMES_LIST]: {
      start   : () => [],
      success : () => payload.map(game => ({ ...game, turns: [] })),
      failure : () => [],
    },
  };

  return handlers[type]
    ? handle(state, action, handlers[type])
    : state;
};
