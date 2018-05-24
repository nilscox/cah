// @flow

import { game } from './api';

export const GAMES_LIST = 'GAMES_LIST';
export const listGames = () => ({
  type: GAMES_LIST,
  promise: game.list(),
});

export const GAME_FETCH = 'GAME_FETCH';
export const fetchGame = () => ({
  type: GAME_FETCH,
  promise: game.fetch(),
});

export const CREATE_GAME = 'CREATE_GAME';
export const createGame = () => ({
  type: CREATE_GAME,
  promise: game.create(),
});

export const START_GAME = 'START_GAME';
export const startGame = () => ({
  type: START_GAME,
  promise: game.start(),
});

export const GAME_JOIN = 'GAME_JOIN';
export const joinGame = (id: number) => ({
  type: GAME_JOIN,
  promise: game.join(id),
});
