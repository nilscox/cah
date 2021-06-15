import { Game } from '../../entities/Game';
import { Question } from '../../entities/Question';
import { QuestionRepository } from '../../interfaces/QuestionRepository';

export class InMemoryQuestionRepository implements QuestionRepository {
  private questions: Question[] = [];

  get() {
    return this.questions;
  }

  async createQuestions(_game: Game, questions: Question[]): Promise<void> {
    this.questions = questions;
  }

  async getNextAvailableQuestion(): Promise<Question | undefined> {
    return this.questions?.[0];
  }
}
