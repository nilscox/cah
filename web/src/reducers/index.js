import { combineReducers } from 'redux';
import { API_STATE, WS_STATE } from '../constants';
import { append, remove } from './utils';
import player from './player';
import game from './game';

const selection = (state = [], action) => {
  if (action.type === 'GAME_TOGGLE_CHOICE') {
    if (state.indexOf(action.choice) < 0)
      return append(state, action.choice);
    else
      return remove(state, action.choice);
  }

  if (action.type === 'WS_NEXT_TURN')
    return [];

  return state;
};

const fetching = (state = {
  game: false,
  player: false,
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
      return { ...state, game: false };

    default:
      return state;
  }
};

const status = (state = {
  appInitializing: false,
  api: API_STATE.UP,
  websocket: WS_STATE.CLOSED,
}, action) => {
  if (action.type === 'INITIALIZATION_STARTED')
    return { ...state, appInitializing: true };

  if (action.type === 'INITIALIZATION_FINISHED')
    return { ...state, appInitializing: false };

  if (action.type === 'API_DOWN')
    return { ...state, api: API_STATE.DOWN };

  if (action.type === 'API_UP')
    return { ...state, api: API_STATE.UP };

  if (action.type === 'WEBSOCKET_CREATED')
    return { ...state, websocket: WS_STATE.CREATED };

  if (action.type === 'WEBSOCKET_CLOSED')
    return { ...state, websocket: WS_STATE.CLOSED };

  if (action.type === 'WEBSOCKET_CONNECTED')
    return { ...state, websocket: WS_STATE.CONNECTED };

  return state;
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

/**
 * state: {
 *   player: {
 *     nick: string,
 *     score: integer,
 *     cards: Choice[],
 *     submitted: FullAnsweredQuestion,
 *   },
 *   game: {
 *     id: integer,
 *     state: string,
 *     owner: string,
 *     players: Player[],
 *     question_master: string,
 *     question: Question,
 *     propositions: AnsweredQuestion[],
 *   },
 *   selection: Choice[],
 *   fetching: {
 *     player: bool,
 *     game: bool,
 *   },
 *   status: {
 *     appInitializing: bool,
 *     api: string,
 *     websocket: string,
 *   },
 *   error: {
 *     detail: string,
 *   },
 * }
 */

export default combineReducers({
  player,
  game,
  selection,
  fetching,
  status,
  error,
});
