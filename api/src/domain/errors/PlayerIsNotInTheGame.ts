import { Game } from '../models/Game';
import { Player } from '../models/Player';

import { DomainError } from './DomainError';

export class PlayerIsNotInTheGameError extends DomainError {
  constructor(readonly game: Game, readonly player: Player) {
    super('Player is not part of the game');
  }
}
