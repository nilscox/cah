import { DomainError } from '../../ddd/DomainError';
import { Player } from '../models/Player';

export class PlayerIsQuestionMasterError extends DomainError {
  constructor(public readonly player: Player) {
    super('Player is the question master');
  }
}
