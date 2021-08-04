import { Player } from '../models/Player';

import { DomainError } from './DomainError';

export class PlayerIsQuestionMasterError extends DomainError {
  constructor(readonly player: Player) {
    super('Player is the question master');
  }
}
