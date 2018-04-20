// @flow

import { player } from '../api';

export const PLAYER_LOGIN = 'PLAYER_LOGIN';
export const loginPlayer = (nick) => ({
  type: PLAYER_LOGIN,
  promise: player.login(nick),
});
