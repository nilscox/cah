import { handle } from 'redux-pack';

import { GAME_LIST } from './actions';

const initialState = {
  loading: false,
  gamesList: null,
};

export default function(state = initialState, action) {
  const handlers = {
    GAME_LIST: {
      success: prevState => ({ ...prevState, gamesList: action.payload.body }),
    },
  };

  const handler = handlers[action.type];

  if (handler)
    return handle(state, action, handler);

  return state;
}
