import { handle } from 'redux-pack';

import {
  GAMES_LIST,
  GAME_FETCH_HISTORY,
  GAME_CREATE,
  WS_MESSAGE,
} from '../actions';

const findGame = (games, gameId) => games.find(game => game === gameId);

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
    return state.merge([gameIdx, 'players'], [message.nick]);

  case GAME_PLAYER_LEFT:
    const game = state[gameIdx];
    const players = game.players;

    return state.set([gameIdx, 'players'], players.filter(p => p.nick !== message.nick));

  case GAME_CREATED:
    return state.push(crio(message.game).set('turns', []));

  case GAME_STARTED:
  case GAME_NEXT_TURN:
  case GAME_ANSWER_SUBMITTED:
  case GAME_ANSWER_SELECTED:
    return state.set(gameIdx, message.game);

  default:
    return state;
  }
};

export default (state = crio([]), action) => {
  const { type, payload, meta } = action;
  const findGame = (games, id) => games.findIndex(g => g.id === id);

  const handlers = {
    [GAMES_LIST]: {
      start   : () => [],
      success : () => payload.map(game => ({ ...game, turns: [] })),
      failure : () => [],
    },
    [GAME_FETCH_HISTORY]: {
      start   : (games) => games,
      success : (games) => games,
    },
    [GAME_CREATE]: {
      success : () => [ ...state, { ...payload, turns: [] } ],
    },
  };

  return handlers[type]
    ? handle(state, action, handlers[type])
    : state;
};
