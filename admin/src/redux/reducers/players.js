import { handle } from 'redux-pack';
import { fromJS, List } from 'immutable';

import { PLAYERS_LIST } from '../actions';

export default (state = List(), action) => {
  const { type, payload } = action;

  const handlers = {
    [PLAYERS_LIST]: {
      start   : () => [],
      success : () => fromJS(payload),
      failure : () => [],
    },
  };

  return handlers[type]
    ? handle(state, action, handlers[type])
    : state;
};
