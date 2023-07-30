import { hasProperty } from '@cah/utils';

import { Question } from 'src/entities';

import { InMemoryRepository } from '../../in-memory-repository';

import { QuestionRepository } from './question.repository';

export class InMemoryQuestionRepository extends InMemoryRepository<Question> implements QuestionRepository {
  async findById(id: string): Promise<Question> {
    const item = this.get(id);

    if (!item) {
      throw new Error('Question not found');
    }

    return Promise.resolve(item);
  }

  async findNextAvailableQuestion(gameId: string): Promise<Question | undefined> {
    return this.find(hasProperty('gameId', gameId));
  }

  async insertMany(questions: Question[]): Promise<void> {
    this.set(...questions);
  }
}
