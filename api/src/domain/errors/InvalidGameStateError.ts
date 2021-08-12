import { GameState } from '../../shared/enums';

import { DomainError } from './DomainError';

export class InvalidGameStateError extends DomainError {
  constructor(readonly expected: GameState, readonly actual: GameState) {
    super(`Invalid game state: expected the game state to be ${expected}, but it is ${actual}`, {
      expected,
      actual,
    });
  }
}
