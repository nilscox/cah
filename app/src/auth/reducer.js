import { handle } from 'redux-pack';
import { PLAYER_LOGIN } from './actions';


export default function(state = null, action) {
  const handlers = {
    PLAYER_LOGIN: {
      success: prevState => ({ ...prevState, player: action.payload.body }),
    },
  };

  const handler = handlers[action.type];

  if (handler)
    return handle(state, action, handler);

  return state;
}
