import { DomainError } from '../../ddd/DomainError';
import { Player } from '../models/Player';

export class InvalidChoicesSelectionError extends DomainError {
  constructor(public readonly player: Player, public readonly choicesIds: string[]) {
    super('Invalid choices selection: player does not own some of the choices');
  }
}
