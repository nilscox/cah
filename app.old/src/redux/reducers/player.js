import { handle } from 'redux-pack';

import initialState from '../state';
import {
  API_DOWN,
  PLAYER_LOGOUT,
  PLAYER_FETCH, PLAYER_LOGIN,
  TOGGLE_CHOICE, SUBMIT_ANSWER,
  WEBSOCKET_MESSAGE,
} from '../actions';

const websocket = (state, message) => {
  if (message.type === 'CARDS_DEALT')
    return { ...state, cards: message.cards };

  return state;
};

export default (state = initialState.player, action) => {
  const { type, payload } = action;

  if (action.type === API_DOWN || action.type === PLAYER_LOGOUT)
    return initialState.player;

  if (action.type === WEBSOCKET_MESSAGE)
    return websocket(state, action.message);

  if (action.type === TOGGLE_CHOICE) {
    const selectedChoices = state.selectedChoices.slice();
    const { choice } = action;
    const idx = selectedChoices.findIndex(c => c && c.id === choice.id);

    if (idx < 0) {
      const firstNull = selectedChoices.findIndex(c => c === null);

      if (firstNull >= 0)
        selectedChoices.splice(firstNull, 1, choice);
      else
        selectedChoices.push(choice);
    }
    else
      selectedChoices.splice(idx, 1, null);

    return {
      ...state,
      selectedChoices,
    };
  }

  const handlers = {
    [PLAYER_FETCH]: {
      start: () => null,
      success: () => ({ ...payload, selectedChoices: [] }),
      failure: () => null,
    },
    [PLAYER_LOGIN]: {
      start: () => null,
      success: () => ({ ...payload, selectedChoices: [] }),
      failure: () => null,
    },
    [SUBMIT_ANSWER]: {
      success: () => ({ ...state, selectedChoices: [], submitted: payload }),
    },
  };

  return handlers[type]
    ? handle(state, action, handlers[type])
    : state;
}
