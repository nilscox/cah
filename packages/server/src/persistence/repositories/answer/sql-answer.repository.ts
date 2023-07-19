import { Database } from '../../database';

import { AnswerRepository } from './answer.repository';

export class SqlAnswerRepository implements AnswerRepository {
  constructor(private readonly db: Database) {}
}
