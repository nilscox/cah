import { EntityNotFoundError } from './EntityNotFoundError';

export class AnswerNotFoundError extends EntityNotFoundError {
  constructor(query: Record<string, string>) {
    super('Answer', query);
  }
}
