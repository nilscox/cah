import { PlayState } from '../../shared/enums';

import { DomainError } from './DomainError';

export class InvalidPlayStateError extends DomainError {
  constructor(readonly expected: PlayState, readonly actual: PlayState) {
    super(`Invalid play state: expected the play state to be ${expected}, but it is ${actual}`, {
      expected,
      actual,
    });
  }
}
