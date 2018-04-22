// @flow

import type { Game } from './game';
import type { Player } from './player';

export type State = {
  auth: ?{
    player: Player,
  },
  lobby: {
    loading: boolean,
    gamesList: Game[],
  },
};