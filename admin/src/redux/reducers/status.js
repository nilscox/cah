import initialState from '../state';
import {
  INITIALIZATION_STARTED,
  INITIALIZATION_FINISHED,
} from '../actions'

export default (state = initialState.status, action) => {
  switch (action.type) {
    case INITIALIZATION_STARTED:
      return { ...state, initializing: true };

    case INITIALIZATION_FINISHED:
      return { ...state, initializing: false, ready: true };

    default:
      return state;
  }
};
