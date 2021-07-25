import { Choice } from './Choice';
import { Player } from './Player';

export interface Answer {
  id: string;
  player?: Player;
  choices: Choice[];
  formatted: string;
}
