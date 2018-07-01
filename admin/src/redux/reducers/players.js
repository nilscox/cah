import { handle } from 'redux-pack';
import { fromJS, List } from 'immutable';

import { PLAYERS_LIST , PLAYER_CREATE } from '../actions';

export default (state = List(), action) => {
  const { type, payload } = action;

  const handlers = {
    [PLAYERS_LIST]: {
      start   : () => [],
      success : () => fromJS(payload),
      failure : () => [],
    },
    [PLAYER_CREATE]: {
      success : () => state.push(fromJS(payload)),
    },
  };

  return handlers[type]
    ? handle(state, action, handlers[type])
    : state;
};
