import { DomainError } from './DomainError';

export class InvalidNumberOfChoicesError extends DomainError {
  constructor(public expected: number, public actual: number) {
    super(`Invalid number of choices: expected ${expected}, got ${actual}`, { expected, actual });
  }
}
