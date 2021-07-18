import { Player } from '../models/Player';

import { DomainError } from './DomainError';

export class PlayerIsQuestionMasterError extends DomainError {
  constructor(public readonly player: Player) {
    super('Player is the question master');
  }
}
