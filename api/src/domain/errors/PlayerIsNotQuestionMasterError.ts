import { Player } from '../models/Player';

import { DomainError } from './DomainError';

export class PlayerIsNotQuestionMasterError extends DomainError {
  constructor(public readonly player: Player) {
    super('Player is not the question master');
  }
}
