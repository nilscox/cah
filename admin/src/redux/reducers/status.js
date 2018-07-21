import crio from 'crio';

import initialState from '../state';
import {
  INITIALIZATION_STARTED,
  INITIALIZATION_FINISHED,
} from '../actions'

export default (state = crio(initialState.status), action) => {
  switch (action.type) {
    case INITIALIZATION_STARTED:
      return state.set('initializing', true);

    case INITIALIZATION_FINISHED:
      return state
        .set('initializing', false)
        .set('ready', true);

    default:
      return state;
  }
};
