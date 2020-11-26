import { Server } from 'socket.io';

import { State } from './types/State';
import { Player } from './types/Player';
import { Game } from './types/Game';

declare module 'express-serve-static-core' {

  export interface Request {

    state: State;

    player?: Player;
    game?: Game;

    io: Server;

  }

}
