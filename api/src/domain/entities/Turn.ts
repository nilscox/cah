import { Answer } from './Answer';
import { Player } from './Player';
import { Question } from './Question';

export class Turn {
  id!: number;

  questionMaster!: Player;
  question!: Question;
  answers!: Answer[];
  winner!: Player;
}
