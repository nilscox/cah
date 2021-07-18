import { DomainError } from './DomainError';

export class InvalidNumberOfChoicesError extends DomainError {
  constructor(public readonly expected: number, public readonly actual: number) {
    super(`Invalid number of choices: expected ${expected}, got ${actual}`);
  }
}
