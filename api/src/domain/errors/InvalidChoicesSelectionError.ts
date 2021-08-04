import { Player } from '../models/Player';

import { DomainError } from './DomainError';

export class InvalidChoicesSelectionError extends DomainError {
  constructor(readonly player: Player, readonly choicesIds: string[]) {
    super('Invalid choices selection: player does not own some of the choices');
  }
}
