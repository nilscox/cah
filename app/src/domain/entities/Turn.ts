import { Answer } from './Answer';
import { Player } from './Player';
import { Question } from './Question';

export type Turn = {
  number: number;
  question: Question;
  winner: Player;
  answers: Answer[];
};
