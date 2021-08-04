import { DomainError } from './DomainError';

export abstract class EntityNotFoundError extends DomainError {
  constructor(entity: string, query?: Record<string, string>) {
    super(`${entity} not found`, { query });
  }
}
