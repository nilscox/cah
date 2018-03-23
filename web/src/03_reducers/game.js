import { append, remove, replace } from './utils';

export default function(state = null, action) {
  const message = action.message;
  const findPlayerByNick = nick => p => p.nick === nick;

  if (action.type === 'PLAYER_LOGOUT_SUCCESS' || action.type === 'API_DOWN')
    return null;

  if (action.type === 'GAME_FETCH_SUCCESS' && action.status === 404)
    return null;

  if ([
    'GAME_FETCH_SUCCESS',
    'GAME_CREATE_SUCCESS',
    'GAME_JOIN_SUCCESS',
    'GAME_START_SUCCESS',
  ].indexOf(action.type) >= 0)
    return { ...action.body, has_submitted: [], history: [] };

  if (action.type === 'GAME_FETCH_HISTORY_SUCCESS')
    return { ...state, history: action.body };

  if (!state || !state.id || !message)
    return state;

  if (action.type === 'WEBSOCKET_MESSAGE') {
    switch (action.message.type) {
      case 'PLAYER_AVATAR_CHANGED':
        if (state.players.findIndex(findPlayerByNick(message.player.nick)) < 0)
          return state;

        return {
          ...state,
          players: replace(state.players, message.player, findPlayerByNick(message.player.nick))
        };

      case 'JOINED':
        if (state.players.findIndex(findPlayerByNick(message.player.nick)) >= 0)
          return state;

        return {
          ...state,
          players: append(state.players, message.player),
        };

      case 'LEFT':
        return {
          ...state,
          players: remove(state.players, findPlayerByNick(message.player.nick)),
        };

      case 'CONNECTED':
        return {
          ...state,
          players: replace(state.players, message.player, findPlayerByNick(message.player.nick)),
        };

      case 'DISCONNECTED':
        return {
          ...state,
          players: replace(state.players, p => ({ ...p, connected: false }), p => p.nick === message.nick),
        };

      case 'GAME_STARTED':
        return {...message.game, has_submitted: [], history: []};

      case 'ANSWER_SUBMITTED':
        return {...state, has_submitted: [...state.has_submitted, message.nick]};

      case 'ALL_ANSWERS_SUBMITTED':
        return {
          ...state,
          has_submitted: state.players.filter(p => p.nick !== state.question_master).map(p => p.nick),
          play_state: 'question_master_selection',
          propositions: message.answers
        };

      case 'ANSWER_SELECTED':
        return {
          ...state,
          has_submitted: [],
          play_state: 'end_of_turn',
          history: [...state.history, message.turn],
          players: replace(state.players, p => ({ ...p, score: p.score + 1 }), p => p.nick === message.turn.winner),
        };

      case 'NEXT_TURN':
        return { ...state, ...message.game };

      default:
        break;
    }
  }

  return state;
}
