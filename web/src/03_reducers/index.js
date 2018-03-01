import { combineReducers } from 'redux';
import { API_STATE, WS_STATE } from '../constants';
import player from './player';
import game from './game';

const settings = (state = {
  darkMode: false,
}, action) => {
  if (action.type === 'SETTINGS_SET_VALUE') {
    const setting = {};

    setting[action.setting] = action.value;

    return { ...state, ...setting };
  }

  return state;
};

const fetching = (state = {
  player: false,
  game: false,
  gameHistory: false,
}, action) => {
  switch (action.type) {
    case 'PLAYER_LOGIN_REQUEST':
    case 'PLAYER_FETCH_REQUEST':
      return { ...state, player: true };

    case 'PLAYER_LOGIN_SUCCESS':
    case 'PLAYER_FETCH_SUCCESS':
    case 'PLAYER_LOGIN_FAILURE':
    case 'PLAYER_FETCH_FAILURE':
      return { ...state, player: false };

    case 'GAME_FETCH_REQUEST':
      return { ...state, game: true };

    case 'GAME_FETCH_SUCCESS':
    case 'GAME_FETCH_FAILURE':
      return { ...state, gameHistory: false };

    case 'GAME_FETCH_HISTORY_REQUEST':
      return { ...state, gameHistory: true };

    case 'GAME_FETCH_HISTORY_SUCCESS':
    case 'GAME_FETCH_HISTORY_FAILURE':
      return { ...state, gameHistory: false };

    default:
      return { ...state, fetching: fetching(state, action) };
  }
};

const status = (state = {
  appInitializing: false,
  api: API_STATE.UP,
  websocket: WS_STATE.CLOSED,
}, action) => {
  switch(action.type) {
    case 'INITIALIZATION_STARTED':
      return { ...state, appInitializing: true };
    case 'INITIALIZATION_FINISHED':
      return { ...state, appInitializing: false };

    case 'API_DOWN':
      return { ...state, api: API_STATE.DOWN };
    case 'API_UP':
      return { ...state, api: API_STATE.UP };

    case 'WEBSOCKET_CREATED':
      return { ...state, websocket: WS_STATE.CREATED };
    case 'WEBSOCKET_CLOSED':
      return { ...state, websocket: WS_STATE.CLOSED };
    case 'WEBSOCKET_CONNECTED':
      return { ...state, websocket: WS_STATE.CONNECTED };
    default:
      return state;
  }
};

const error = (state = null, action) => {
  if (action.type.endsWith('_FAILURE')) {
    if (action.error && action.error.body && action.error.body.detail)
      return { ...action.error.body };
    else
      return { detail: 'Unknown error' };
  }

  if (action.type === 'CLEAR_ERROR')
    return null;

  return state;
};

export default combineReducers({
  player,
  game,
  settings,
  status,
  error,
});
