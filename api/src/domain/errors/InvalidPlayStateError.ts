import { DomainError } from '../../ddd/DomainError';
import { PlayState } from '../enums/PlayState';

export class InvalidPlayStateError extends DomainError {
  constructor(public readonly expected: PlayState, public readonly actual: PlayState) {
    super(`Invalid play state: expected the play state to be ${expected}, but it is ${actual}`);
  }
}
