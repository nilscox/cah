import { DomainError } from '../../ddd/DomainError';
import { GameState } from '../enums/GameState';

export class InvalidGameStateError extends DomainError {
  constructor(public readonly expected: GameState, public readonly actual: GameState) {
    super(`Invalid game state: expected the game state to be ${expected}, but it is ${actual}`);
  }
}
