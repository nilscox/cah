import { Question } from 'src/entities';

export interface QuestionRepository {
  findById(questionId: string): Promise<Question>;
  findNextAvailableQuestion(gameId: string): Promise<Question | undefined>;
  insertMany(questions: Question[]): Promise<void>;
}
