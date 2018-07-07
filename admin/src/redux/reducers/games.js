import crio from 'crio';
import { handle } from 'redux-pack';

import {
  GAMES_LIST,
  GAME_FETCH_HISTORY,
  GAME_CREATE,
  WS_MESSAGE,
} from '../actions';

const GAME_CREATED = 'GAME_CREATED';
const GAME_STARTED = 'GAME_STARTED';
const PLAYER_JOINED = 'PLAYER_JOINED';
const PLAYER_LEFT = 'PLAYER_LEFT';
const ANSWER_SUBMITTED = 'ANSWER_SUBMITTED';
const ANSWER_SELECTED = 'ANSWER_SELECTED';
const GAME_NEXT_TURN = 'GAME_NEXT_TURN';

// eslint-disable-next-line eqeqeq
const findGameIdx = (games, gameId) => games.findIndex(game => game.id == gameId);

const findPlayerIdx = (players, nick) => players.findIndex(player => player.nick === nick);

const websocket = (state, message) => {
  const gameIdx = message.game && findGameIdx(state, message.game.id);

  switch (message.type) {
  case PLAYER_JOINED:
    return state.merge([gameIdx, 'players'], [message.player]);

  case PLAYER_LEFT:
    const game = state[gameIdx];
    const players = game.players;

    return state.merge([gameIdx, 'players'], players.splice(findPlayerIdx(players, message.player.nick), 1));

  case GAME_CREATED:
    return state.push(message.game);

  case GAME_STARTED:
  case GAME_NEXT_TURN:
  case ANSWER_SUBMITTED:
    return state.merge(gameIdx, message.game);

  case ANSWER_SELECTED:
    return state.merge([gameIdx, 'turns'], message.turn);

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
    [GAME_CREATE]: {
      success : () => state.push(crio(payload)),
    },
  };

  return handlers[type]
    ? handle(state, action, handlers[type])
    : state;
};
