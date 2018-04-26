// @flow

import { player } from '~/api';
import type { Action } from '~/types/actions';

export const PLAYER_FETCH = 'PLAYER_FETCH';
export const fetchPlayer = (): Action => ({
  type: PLAYER_FETCH,
  promise: player.fetch(),
});

export const PLAYER_LOGIN = 'PLAYER_LOGIN';
export const loginPlayer = (nick: string): Action => ({
  type: PLAYER_LOGIN,
  promise: player.login(nick),
});
