import initialState from '../state';
import {
  INITIALIZATION_STARTED,
  INITIALIZATION_FINISHED,
} from '../actions/initialization';
import { API_UP, API_DOWN } from '../actions/status';
import {
  WEBSOCKET_CREATE,
  WEBSOCKET_OPEN,
  WEBSOCKET_CLOSE,
} from '../actions/websocket';

export default (state = initialState.status, action) => {
  if (action.type === INITIALIZATION_STARTED)
    return { ...state, app: 'initializing' };

  if (action.type === INITIALIZATION_FINISHED)
    return { ...state, app: 'ready' };

  if (action.type === WEBSOCKET_CREATE)
    return { ...state, websocket: 'created' };

  if (action.type === WEBSOCKET_OPEN)
    return { ...state, websocket: 'open' };

  if (action.type === WEBSOCKET_CLOSE)
    return { ...state, websocket: 'closed' };

  if (action.type === API_UP)
    return { ...state, api: 'up' };

  if (action.type === API_DOWN)
    return { ...state, api: 'down' };

  return state;
};
