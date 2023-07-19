import { Question } from 'src/entities';

export interface QuestionRepository {
  findById(questionId: string): Promise<Question>;
  insertMany(questions: Question[]): Promise<void>;
}
