import { DomainError } from '../../ddd/DomainError';

export class NoMoreChoiceError extends DomainError {
  constructor() {
    super('No more choices');
  }
}
