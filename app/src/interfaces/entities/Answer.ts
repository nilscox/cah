import { Player } from './Player';

export interface Answer {
  id: string;
  player?: Player;
  choices: string[];
  formatted: string;
}
