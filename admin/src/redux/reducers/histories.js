import crio from 'crio';
import { handle } from 'redux-pack';

import {
  GAME_FETCH_HISTORY,
} from '../actions';

export default (state = crio({}), action) => {
  const { type, payload, meta } = action;

  const handlers = {
    [GAME_FETCH_HISTORY]: {
      success : (histories) => histories.set(meta.gameId, crio(payload)),
    },
  };

  return handlers[type]
    ? handle(state, action, handlers[type])
    : state;
};
