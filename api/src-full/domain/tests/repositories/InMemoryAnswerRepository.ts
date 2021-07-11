import _ from 'lodash';

import { Answer } from '../../entities/Answer';
import { AnswerRepository } from '../../interfaces/AnswerRepository';

import { InMemoryRepository } from './InMemoryRepository';

export class InMemoryAnswerRepository extends InMemoryRepository<Answer> implements AnswerRepository {
  async saveAll(answers: Answer[]): Promise<void> {
    _.forEach(answers, this.save.bind(this));
  }
}
