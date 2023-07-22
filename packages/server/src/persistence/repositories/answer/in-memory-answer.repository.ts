import { Answer } from 'src/entities';
import { compareByProperty } from 'src/utils/compare-by-property';
import { hasProperty } from 'src/utils/has-property';

import { EntityNotFoundError } from '../../entity-not-found-error';
import { InMemoryRepository } from '../../in-memory-repository';

import { AnswerRepository } from './answer.repository';

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
