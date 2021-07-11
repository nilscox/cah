import { Choice } from '../entities/Choice';
import { Player } from '../entities/Player';

export class InvalidChoicesSelectionError extends Error {
  constructor(public readonly player: Player, public readonly selection: Choice[]) {
    super('choices are not owned by the player');
    Object.setPrototypeOf(this, InvalidChoicesSelectionError.prototype);
  }
}
