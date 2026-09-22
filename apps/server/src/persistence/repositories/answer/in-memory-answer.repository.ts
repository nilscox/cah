import { compareByProperty, hasProperty } from '@cah/utils';

import { type Answer } from 'src/entities';

import { EntityNotFoundError } from '../../entity-not-found-error.ts';
import { InMemoryRepository } from '../../in-memory-repository.ts';

import { type AnswerRepository } from './answer.repository.ts';

export class InMemoryAnswerRepository extends InMemoryRepository<Answer> implements AnswerRepository {
  async findById(answerId: string): Promise<Answer> {
    const answer = this.get(answerId);

    if (!answer) {
      throw new EntityNotFoundError('Answer', { id: answerId });
    }

    return answer;
  }

  async findForCurrentTurn(gameId: string): Promise<Answer[]> {
    const compare = compareByProperty<Answer, 'place'>('place', (a, b) => (a ?? 0) - (b ?? 0));

    return this.filter(hasProperty('gameId', gameId)).sort(compare);
  }

  async insert(answer: Answer): Promise<void> {
    this.set(answer);
  }

  async updateMany(answers: Answer[]): Promise<void> {
    this.set(...answers);
  }
}
