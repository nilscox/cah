import { DomainError } from '../../ddd/DomainError';
import { Player } from '../models/Player';

export class PlayerAlreadyAnsweredError extends DomainError {
  constructor(public readonly player: Player) {
    super('Player has already answered');
  }
}
