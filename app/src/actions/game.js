// @flow

import { game } from './api';
import type { Action } from '~/types/actions';

export const GAMES_LIST = 'GAMES_LIST';
export const listGames = () => ({
  type: GAMES_LIST,
  promise: game.list(),
});

export const GAME_FETCH = 'GAME_FETCH';
export const fetchGame = (): Action => ({
  type: GAME_FETCH,
  promise: game.fetch(),
});

export const CREATE_GAME = 'CREATE_GAME';
export const createGame = () => ({
  type: CREATE_GAME,
  promise: game.create(),
});

export const GAME_JOIN = 'GAME_JOIN';
export const joinGame = (id: number): Action => ({
  type: GAME_JOIN,
  promise: game.join(id),
});
