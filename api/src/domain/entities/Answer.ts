import { Choice } from './Choice';
import { Player } from './Player';

export class Answer {
  id!: number;

  player!: Player;
  choices!: Choice[];
}
