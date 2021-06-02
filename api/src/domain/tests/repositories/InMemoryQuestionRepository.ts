import { Game } from '../../entities/Game';
import { Question } from '../../entities/Question';
import { QuestionRepository } from '../../interfaces/QuestionRepository';
import { createQuestions } from '../creators';

export class InMemoryQuestionRepository implements QuestionRepository {
  private questions = new Map<Game, Question[]>();

  async createQuestions(game: Game, questions: Question[]): Promise<void> {
    this.questions.set(game, questions);
  }

  async pickRandomQuestions(count: number): Promise<Question[]> {
    return createQuestions(count);
  }

  async getNextAvailableQuestion(game: Game): Promise<Question | undefined> {
    return this.questions.get(game)?.[0];
  }

  getQuestions(game: Game) {
    return this.questions.get(game);
  }
}
