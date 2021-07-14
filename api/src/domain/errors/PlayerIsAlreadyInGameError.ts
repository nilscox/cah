import { DomainError } from '../../ddd/DomainError';
import { Player } from '../models/Player';

export class PlayerIsAlreadyInGameError extends DomainError {
  constructor(public readonly player: Player) {
    super('Player is already in a game');
  }
}
