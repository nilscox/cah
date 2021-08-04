import { EntityNotFoundError } from './EntityNotFoundError';

export class PlayerNotFoundError extends EntityNotFoundError {
  constructor(query: Record<string, string>) {
    super('Player', query);
  }
}
