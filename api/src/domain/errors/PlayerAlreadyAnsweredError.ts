import { Player } from '../models/Player';

import { DomainError } from './DomainError';

export class PlayerAlreadyAnsweredError extends DomainError {
  constructor(public readonly player: Player) {
    super('Player has already answered');
  }
}
