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
import { replace, replaceOrPush, remove } from './immutable';

const PLAYER_CONNECTED = 'PLAYER_CONNECTED';
const PLAYER_DISCONNECTED = 'PLAYER_DISCONNECTED';
const PLAYER_JOINED = 'PLAYER_JOINED';
const GAME_RESET = 'GAME_RESET';
const GAME_STARTED = 'GAME_STARTED';

const handleWebsocket = (state = initialState.game, message) => {
  const { type } = message;
  const player = message.player;
  const isPlayer = (p) => p.nick === player.nick;

  if (!state)
    return state;

  const handlers = {
    [PLAYER_CONNECTED]: () => ({
      ...state,
      players: replace(state.players, isPlayer, player),
    }),
    [PLAYER_DISCONNECTED]: () => ({
      ...state,
      players: remove(state.players, isPlayer),
    }),
    [PLAYER_JOINED]: () => ({
      ...state,
      players: replaceOrPush(state.players, isPlayer, player),
    }),
    [GAME_RESET]: () => message.game,
    [GAME_STARTED]: () => message.game,
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
