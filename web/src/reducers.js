import { combineReducers } from 'redux';

const player_ws = (state, message) => {
  if (message.type === 'cards_dealt')
    return { ...state, cards: [ ...state.cards, ...message.cards ] };

  return state;
};

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

    case 'WS_MESSAGE':
      return player_ws(state, action.message);

    default:
      return state;
  }
};

const game_ws = (state, message) => {
  if (!state || !state.id)
    return state;

  if (message.type === 'joined') {
    if (state.players.map(p => p.nick).indexOf(message.player.nick) >= 0)
      return state;

    return {
      ...state,
      players: [
        ...state.players,
        message.player
      ],
    };
  }

  if (message.type === 'left') {
    const idx = state.players.map(p => p.nick).indexOf(message.player.nick);

    if (idx < 0)
      return state;

    return {
      ...state,
      players: [
        ...state.players.slice(0, idx),
        ...state.players.slice(idx + 1)
      ],
    };
  }

  if (message.type === 'connected') {
    const idx = state.players.map(p => p.nick).indexOf(message.player.nick);

    if (idx < 0)
      return state;

    return {
      ...state,
      players: [
        ...state.players.slice(0, idx),
        { ...state.players[idx], connected: true },
        ...state.players.slice(idx + 1)
      ],
    };
  }

  if (message.type === 'disconnected') {
    const idx = state.players.map(p => p.nick).indexOf(message.player.nick);

    if (idx < 0)
      return state;

    return {
      ...state,
      players: [
        ...state.players.slice(0, idx),
        { ...state.players[idx], connected: false },
        ...state.players.slice(idx + 1)
      ],
    };
  }

  if (message.type === 'game_started')
    return message.game;

  return state;
};

const game = (state = null, action) => {
  if (action.type === 'GAME_FETCH_REQUEST')
    return { ...state, fetching: true };

  if ([
    'GAME_FETCH_SUCCESS',
    'GAME_CREATE_SUCCESS',
    'GAME_JOIN_SUCCESS',
    'GAME_START_SUCCESS',
  ].indexOf(action.type) >= 0) {
    if (action.status === 404)
      return null;

    return { ...action.body, selectedChoices: [], fetching: false };
  }

  if (action.type === 'GAME_FETCH_FAILURE')
    return { ...state, fetching: false };

  if (action.type === 'WS_MESSAGE')
    state = game_ws(state, action.message);

  return state;
};

const error = (state = null, action) => {
  if (action.type.endsWith('_FAILURE'))
    return { ...action.error };

  if (action.type === 'CLEAR_ERROR')
    return null;

  return state;
};

const loading = (state = true, action) => {
  if (action.type === 'INITIALIZED')
    return false;

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
  }

  return state;
};

const wsState = (state = null, action) => {
  if (action.type === 'WS_CREATED')
    return 'created';

  if (action.type === 'WS_CONNECTED')
    return 'connected';

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
  wsState,
  error,
  loading,
});
