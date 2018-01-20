import { combineReducers } from 'redux';
import {API_STATE, WS_STATE} from './constants';

const player = (state = null, action) => {
  switch (action.type) {
    case 'PLAYER_LOGIN_REQUEST':
    case 'PLAYER_FETCH_REQUEST':
      return { ...state, fetching: true };

    case 'PLAYER_FETCH_SUCCESS':
    case 'PLAYER_LOGIN_SUCCESS':
      if (action.status === 404)
        return null;

      return { ...action.body, fetching: false };

    case 'PLAYER_LOGIN_FAILURE':
    case 'PLAYER_FETCH_FAILURE':
      return { ...state, fetching: false };

    case 'PLAYER_LOGOUT_SUCCESS':
      return null;

    case 'GAME_SUBMIT_ANSWER_SUCCESS':
      const submitted = action.body;
      const cardsIdx = submitted.answers.map(choice => choice.id);
      const cards = state.cards.filter(card => cardsIdx.indexOf(card.id) < 0);

      return { ...state, cards, submitted };

    case 'WS_CARDS_DEALT':
      const message = action.message;

      return { ...state, cards: [ ...(state.cards || []), ...message.cards ] };

    case 'WS_NEXT_TURN':
      return { ...state, submitted: null };

    default:
      return state;
  }
};

const game = (state = null, action) => {
  const message = action.message;
  let idx;

  switch (action.type) {
    case 'GAME_FETCH_REQUEST':
      return {...state, fetching: true};

    case 'GAME_FETCH_SUCCESS':
    case 'GAME_CREATE_SUCCESS':
    case 'GAME_JOIN_SUCCESS':
    case 'GAME_START_SUCCESS':
      if (action.status === 404)
        return null;

      return {...action.body, selectedChoices: [], has_submitted: [], fetching: false};

    case 'GAME_FETCH_FAILURE':
      return {...state, fetching: false};

    default:
      break;
  }

  if (!state || !state.id || !message)
    return state;

  switch (action.type) {
    case 'WS_JOINED':
      if (state.players.map(p => p.nick).indexOf(message.player.nick) >= 0)
        return state;

      return {
        ...state,
        players: [
          ...state.players,
          message.player
        ],
      };

    case 'WS_LEFT':
      idx = state.players.map(p => p.nick).indexOf(message.player.nick);

      if (idx < 0)
        return state;

      return {
        ...state,
        players: [
          ...state.players.slice(0, idx),
          ...state.players.slice(idx + 1)
        ],
      };

    case 'WS_CONNECTED':
      idx = state.players.map(p => p.nick).indexOf(message.player.nick);

      if (idx < 0)
        return state;

      return {
        ...state,
        players: [
          ...state.players.slice(0, idx),
          message.player,
          ...state.players.slice(idx + 1)
        ],
      };

    case 'WS_DISCONNECTED':
      idx = state.players.map(p => p.nick).indexOf(message.player.nick);

      if (idx < 0)
        return state;

      return {
        ...state,
        players: [
          ...state.players.slice(0, idx),
          {...state.players[idx], connected: false},
          ...state.players.slice(idx + 1)
        ],
      };

    case 'WS_GAME_STARTED':
      return {...message.game, selectedChoices: [], has_submitted: []};

    case 'WS_ANSWER_SUBMITTED':
      return {...state, has_submitted: [...state.has_submitted, message.nick]};

    case 'WS_ALL_ANSWERS_SUBMITTED':
      return {...state, propositions: message.answers};

    case 'WS_NEXT_TURN':
      return { ...state, ...message.game };

    default:
      break;
  }

  return state;
};

const error = (state = null, action) => {
  if (action.type.endsWith('_FAILURE')) {
    if (action.error && action.error.body)
      return { ...action.error.body };
  }

  if (action.type === 'CLEAR_ERROR')
    return null;

  return state;
};

const selection = (state = [], action) => {
  if (action.type === 'GAME_TOGGLE_CHOICE') {
    const idx = state.indexOf(action.choice);

    if (idx < 0)
      return [ ...state, action.choice ];
    else {
      return [
        ...state.slice(0, idx),
        ...state.slice(idx + 1)
      ];
    }
  } else if (action.type === 'WS_NEXT_TURN')
    return [];

  return state;
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

/**
 * {
 *   player: {
 *     id: integer,
 *     nick: string,
 *   },
 *   game: {
 *     id: integer,
 *     state: string,
 *     owner: string,
 *     players: string[],
 *     question_master: string,
 *     question: {
 *       id: integer,
 *       type: string,
 *       text: string,
 *       split: string[],
 *       nb_choices: integer,
 *     },
 *     propositions: {
 *         id: integer,
 *         question: {
 *         id: integer,
 *         type: string,
 *         text: string,
 *         split: string[],
 *         nb_choices: integer,
 *       }[],
 *       text: string,
 *       split: string[],
 *       answers: {
 *         id: integer,
 *         text: string,
 *       }[],
 *     }[],
 *   },
 *   selection: int[],
 *   error: ,
 *   loading: bool,
 * }
 */

export default combineReducers({
  player,
  game,
  selection,
  status,
  error,
});
