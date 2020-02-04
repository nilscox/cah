import { QuestionDTO } from './question.dto';
import { AnswerDTO } from './answer.dto';

export interface TurnDTO {
  number: number;
  question: QuestionDTO;
  questionMaster: string;
  winner: string;
  answers: AnswerDTO[];
}
