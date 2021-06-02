import { Game } from '../entities/Game';
import { Question } from '../entities/Question';

export interface QuestionRepository {
  createQuestions(game: Game, questions: Question[]): Promise<void>;
  pickRandomQuestions(count: number): Promise<Question[]>;
  getNextAvailableQuestion(game: Game): Promise<Question | undefined>;
}
