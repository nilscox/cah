import { Answer } from 'src/entities';

export interface AnswerRepository {
  findById(answerId: string): Promise<Answer>;
  findForCurrentTurn(gameId: string): Promise<Answer[]>;
  insert(answer: Answer): Promise<void>;
  updateMany(answers: Answer[]): Promise<void>;
}
