import { DomainError } from './DomainError';

export class NoMoreChoiceError extends DomainError {
  constructor() {
    super('No more choices');
  }
}
