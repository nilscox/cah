import { Player } from '../models/Player';

import { DomainError } from './DomainError';

export class PlayerIsAlreadyInGameError extends DomainError {
  constructor(public readonly player: Player) {
    super('Player is already in a game');
  }
}
