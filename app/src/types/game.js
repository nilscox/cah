// @flow

import type { Player } from './player';

export type Game = {
  id: number,
  owner: string,
  players: Player[],
};
