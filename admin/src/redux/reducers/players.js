import { handle } from 'redux-pack';

import { PLAYERS_LIST , PLAYER_CREATE } from '../actions';

export default (state = [], action) => {
  const { type, payload } = action;

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
