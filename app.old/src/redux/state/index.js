// @flow

import type { Status } from './status';
import type { FullPlayer } from './player';
import type { Game } from './game';

export default {
  status: {
    app: 'ready',
    api: 'up',
    websocket: 'closed',
  },
  games: [],
  player: null,
  game: null,
};

export type State = {
  status: Status,
  games: Array<Game>,
  player: ?FullPlayer,
  game: ?Game,
};