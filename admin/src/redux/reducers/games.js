import crio from 'crio';
import { handle } from 'redux-pack';

import {
  GAMES_LIST,
  GAME_FETCH_HISTORY,
  WS_MESSAGE,
} from '../actions';

const GAME_CREATED = 'GAME_CREATED';
const GAME_STARTED = 'GAME_STARTED';
const GAME_PLAYER_JOINED = 'GAME_PLAYER_JOINED';
const GAME_PLAYER_LEFT = 'GAME_PLAYER_LEFT';
const GAME_ANSWER_SUBMITTED = 'GAME_ANSWER_SUBMITTED';
const GAME_ANSWER_SELECTED = 'GAME_ANSWER_SELECTED';
const GAME_NEXT_TURN = 'GAME_NEXT_TURN';

// eslint-disable-next-line eqeqeq
const findGameIdx = (games, gameId) => games.findIndex(game => game.id == gameId);

const websocket = (state, message) => {
  const gameIdx = (() => {
    if (message.gameId)
      return findGameIdx(state, message.gameId);

    if (message.game && message.game.id)
      return findGameIdx(state, message.game.id);

    return -1;
  })();

  switch (message.type) {
  case GAME_PLAYER_JOINED:
    return state.merge([gameIdx, 'players'], [message.player]);

  case GAME_PLAYER_LEFT:
    const game = state[gameIdx];
    const players = game.players;

    return state.set([gameIdx, 'players'], players.filter(p => p.nick !== message.nick));

  case GAME_CREATED:
    return state.push(crio({ ...message.game, turns: [] }));

  case GAME_STARTED:
  case GAME_NEXT_TURN:
    return state.set(gameIdx, message.game);

  case GAME_ANSWER_SUBMITTED:
    return state.merge([gameIdx, 'propositions'], [message.answer])

  case GAME_ANSWER_SELECTED:
    return state.merge([gameIdx, 'turns'], [message.turn]);

  default:
    return state;
  }
};

export default (state = crio([]), action) => {
  const { type, payload, meta } = action;

  if (type === WS_MESSAGE)
    return websocket(state, action.message);

  const handlers = {
    [GAMES_LIST]: {
      start   : () => [],
      success : () => crio(payload),
      failure : () => [],
    },
    [GAME_FETCH_HISTORY]: {
      start   : (games) => games,
      success : (games) => games.merge([findGameIdx(state, meta.gameId), 'turns'], crio(payload)),
    },
  };

  return handlers[type]
    ? handle(state, action, handlers[type])
    : state;
};
