import { Player } from '../models/Player';

import { DomainError } from './DomainError';

export class AlreadyFlushedCardsError extends DomainError {
  constructor(readonly player: Player) {
    super('Player has already flushed his cards');
  }
}
