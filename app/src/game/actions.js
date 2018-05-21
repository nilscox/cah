// @flow

import { game } from '~/api';
import type { Action } from '~/types/actions';

export const GAME_FETCH = 'GAME_FETCH';
export const fetchGame = (): Action => ({
  type: GAME_FETCH,
  promise: game.fetch(),
});
