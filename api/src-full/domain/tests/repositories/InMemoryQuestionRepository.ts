import { Game } from '../../entities/Game';
import { Question } from '../../entities/Question';
import { QuestionRepository } from '../../interfaces/QuestionRepository';

import { InMemoryRepository } from './InMemoryRepository';

export class InMemoryQuestionRepository extends InMemoryRepository<Question> implements QuestionRepository {
  async createQuestions(_game: Game, questions: Question[]): Promise<void> {
    this.set(questions);
  }

  async getNextAvailableQuestion(): Promise<Question | undefined> {
    return this.get()[0];
  }
}
