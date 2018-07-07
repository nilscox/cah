import crio from 'crio';
import { handle } from 'redux-pack';

import {
  GAMES_LIST,
  GAME_FETCH_HISTORY,
  GAME_CREATE,
  WS_MESSAGE,
} from '../actions';

const GAME_STARTED = 'GAME_STARTED';
const PLAYER_JOINED = 'PLAYER_JOINED';
const PLAYER_LEFT = 'PLAYER_LEFT';
const ANSWER_SUBMITTED = 'ANSWER_SUBMITTED';
const ANSWER_SELECTED = 'ANSWER_SELECTED';
const GAME_NEXT_TURN = 'GAME_NEXT_TURN';

// eslint-disable-next-line eqeqeq
const findGameIdx = (games, gameId) => games.findIndex(game => game.id == gameId);

const websocket = (state, message) => {
  const gameIdx = message.gameId && findGameIdx(state, message.gameId);

  switch (message.type) {
  case GAME_STARTED:
  case GAME_NEXT_TURN:
    delete message.game.players;
    return state.merge(null, message.game);

  case PLAYER_JOINED:
    return state.merge([gameIdx, 'players'], [message.player]);

  case PLAYER_LEFT:
    return state.merge([gameIdx, 'players'], [message.player]);

  case ANSWER_SUBMITTED:
    return state.merge([gameIdx, 'propositions'], [message.answer]);

  case ANSWER_SELECTED:
    return state.merge([gameIdx, 'turns'], message.turn);

  default:
    return state;
  }
};

export default (state = crio([]), action) => {
  const { type, payload } = action;

  if (type === WS_MESSAGE)
    return websocket(state, action.message);

  const handlers = {
    [GAMES_LIST]: {
      start   : () => [],
      success : () => crio(payload)
        .map(game => game.merge(null, {
          players: game.players.map(player => player.nick),
        })),
      failure : () => [],
    },
    [GAME_FETCH_HISTORY]: {
      start   : (games) => games,
      success : (games) => games,
    },
    [GAME_CREATE]: {
      success : () => state.push(crio(payload).merge(null, {
        players: state.players.map(player => player.nick),
      })),
    },
  };

  return handlers[type]
    ? handle(state, action, handlers[type])
    : state;
};
