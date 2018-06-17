import { handle } from 'redux-pack';

import { PLAYERS_LIST } from '../actions';

export default (state = [], action) => {
  const { type, payload } = action;

  const handlers = {
    [PLAYERS_LIST]: {
      start   : () => [],
      success : () => payload,
      failure : () => [],
    },
  };

  return handlers[type]
    ? handle(state, action, handlers[type])
    : state;
};
