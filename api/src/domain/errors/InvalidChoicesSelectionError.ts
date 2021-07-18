import { Player } from '../models/Player';

import { DomainError } from './DomainError';

export class InvalidChoicesSelectionError extends DomainError {
  constructor(public readonly player: Player, public readonly choicesIds: string[]) {
    super('Invalid choices selection: player does not own some of the choices');
  }
}
