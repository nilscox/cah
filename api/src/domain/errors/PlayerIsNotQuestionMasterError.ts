import { DomainError } from '../../ddd/DomainError';
import { Player } from '../models/Player';

export class PlayerIsNotQuestionMasterError extends DomainError {
  constructor(public readonly player: Player) {
    super('Player is not the question master');
  }
}
