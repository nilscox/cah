import { EntityNotFoundError } from './EntityNotFoundError';

export class GameNotFoundError extends EntityNotFoundError {
  constructor(query: Record<string, string>) {
    super('Game', query);
  }
}
