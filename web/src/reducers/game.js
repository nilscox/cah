import { append, remove, replace } from './utils';

export default function(state = null, action) {
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
        players: replace(state.players, p => ({ ...p, connected: false }), p => p.nick === message.nick),
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
}
