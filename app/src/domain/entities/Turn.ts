import { Answer } from './Answer';
import { Question } from './Question';

export type Turn = {
  number: number;
  question: Question;
  winner: string;
  answers: Answer[];
};
