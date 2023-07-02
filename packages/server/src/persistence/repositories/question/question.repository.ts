import { Question } from 'src/entities';

export interface QuestionRepository {
  findByIdOrFail(questionId: string): Promise<Question>;
  insertMany(questions: Question[]): Promise<void>;
}
