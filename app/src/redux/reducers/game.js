import { handle } from 'redux-pack';

import initialState from '../state';
import {
  API_DOWN,
  PLAYER_LOGOUT,
  GAME_FETCH,
  GAME_CREATE,
  GAME_JOIN,
  GAME_FETCH_HISTORY,
  WEBSOCKET_MESSAGE,
} from '../actions';

const handleWebsocket = (state = initialState.game, message) => {
  const { type } = message;

  if (!state)
    return state;

  const handlers = {
    PLAYER_CONNECTED: () => {
      const players = state.players.slice();
      const { player } = message;
      const idx = players.findIndex(p => p.nick === player.nick);

      if (idx < 0)
        return state;

      players.splice(idx, 1, player);

      return {
        ...state,
        players,
      };
    },
    PLAYER_DISCONNECTED: () => {
      const players = state.players.slice();
      const { player } = message;
      const idx = players.findIndex(p => p.nick === player.nick);

      if (idx < 0)
        return state;

      players.splice(idx, 1);

      return {
        ...state,
        players,
      };
    },
    PLAYER_JOINED: () => {
      const players = state.players.slice();
      const { player } = message;
      const idx = players.findIndex(p => p.nick === player.nick);

      if (idx < 0) {
        return {
          ...state,
          players: [
            ...state.players,
            player,
          ],
        };
      }

      players.splice(idx, 1, player);

      return {
        ...state,
        players,
      };
    },
    GAME_RESET: () => message.game,
  };

  return handlers[type]
    ? handlers[type]()
    : state;
}

export default (state = initialState.game, action) => {
  const { type, payload } = action;

  if (action.type === API_DOWN || action.type === PLAYER_LOGOUT)
    return initialState.game;

  if (action.type === WEBSOCKET_MESSAGE)
    return handleWebsocket(state, action.message);

  const handlers = {
    [GAME_FETCH]: {
      start: () => null,
      success: () => payload,
      failure: () => null,
    },
    [GAME_CREATE]: {
      start: () => null,
      success: () => payload,
      failure: () => null,
    },
    [GAME_JOIN]: {
      start: () => null,
      success: () => payload,
      failure: () => null,
    },
    [GAME_FETCH_HISTORY]: {
      start: prevState => ({ ...prevState, history: null }),
      success: prevState => ({ ...prevState, history: payload }),
      failure: prevState => ({ ...prevState, history: null }),
    },
  };

  return handlers[type]
    ? handle(state, action, handlers[type])
    : state;
}
