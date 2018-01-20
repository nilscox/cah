import { combineReducers } from 'redux';
import { API_STATE, WS_STATE } from './constants';

const append = (list, elem) => {
  return [ ...list, elem ];
};

const remove = (list, func) => {
  const idx = list.findIndex(func);

  if (idx < 0)
    return list;

  return [
    ...list.slice(0, idx),
    ...list.slice(idx + 1),
  ];
};

const replace = (list, elem, func) => {
  const idx = list.findIndex(func);

  if (idx < 0)
    return list;

  return [
    ...list.slice(0, idx),
    typeof elem === 'function' ? elem(list[idx]) : elem,
    ...list.slice(idx + 1),
  ];
};

const player = (state = null, action) => {
  switch (action.type) {
    case 'PLAYER_FETCH_SUCCESS':
      if (action.status === 404)
        return null;

      return action.body;

    case 'PLAYER_LOGIN_SUCCESS':
      return action.body;

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
  const findPlayerByNick = nick => p => p.nick === nick;

  if (action.type === 'GAME_FETCH_SUCCESS' && action.status === 404)
    return null;

  if ([
    'GAME_FETCH_SUCCESS',
    'GAME_CREATE_SUCCESS',
    'GAME_JOIN_SUCCESS',
    'GAME_START_SUCCESS',
  ].indexOf(action.type) >= 0)
    return { ...action.body, has_submitted: [] };

  if (!state || !state.id || !message)
    return state;

  switch (action.type) {
    case 'WS_JOINED':
      if (state.players.findIndex(findPlayerByNick(message.player.nick)) >= 0)
        return state;

      return {
        ...state,
        players: append(state.players, message.player),
      };

    case 'WS_LEFT':
      return {
        ...state,
        players: remove(state.players, findPlayerByNick(message.player.nick)),
      };

    case 'WS_CONNECTED':
      return {
        ...state,
        players: replace(state.players, message.player, findPlayerByNick(message.player.nick)),
      };

    case 'WS_DISCONNECTED':
      return {
        ...state,
        players: replace(state.players, p => ({ ...p, connected: false }), findPlayerByNick(message.player.nick)),
      };

    case 'WS_GAME_STARTED':
      return {...message.game, has_submitted: []};

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

const selection = (state = [], action) => {
  if (action.type === 'GAME_TOGGLE_CHOICE') {
    if (state.indexOf(action.choice) < 0)
      return append(state, action.choice);
    else {
      return remove(state, action.choice);
    }
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
