// @flow

import initialState from '../state';

export default (state: State = initialState.status, action: any) => {
  if (action.type === 'WS_OPEN')
    return { ...state, websocket: 'open' };

  if (action.type === 'WS_CLOSE')
    return { ...state, websocket: 'closed' };

  if (action.type === 'API_UP')
    return { ...state, api: 'up' };

  if (action.type === 'API_DOWN')
    return { ...state, api: 'down' };

  return state;
};
