import { Connection } from 'typeorm';

import { Game } from '../../domain/models/Game';
import { Player } from '../../domain/models/Player';
import { Dependencies } from '../Dependencies';

export abstract class Command {
  quiet = false;

  player?: Player;
  game?: Game;

  constructor(protected readonly connection: Connection, protected readonly deps: Dependencies) {}

  abstract run(args: unknown): void;

  requirePlayer(inGame?: boolean) {
    if (!this.player) {
      throw new Error('player is required');
    }

    if (inGame && !this.game) {
      throw new Error('player is not in game');
    }
  }

  log(...args: Parameters<typeof console.log>) {
    if (this.quiet) {
      return;
    }

    console.log(...args);
  }
}
