import { State } from './types/State';
import { Player } from './types/Player';
import { Game } from './types/Game';
import { Question } from './types/Question';
import { Choice } from './types/Choice';

declare module 'express-serve-static-core' {

  export interface Request {

    state: State;

    player?: Player;
    game?: Game;

    io: SocketIO.Server;

  }

}
