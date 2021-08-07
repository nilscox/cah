import { Choice } from './Choice';
import { Player } from './Player';

export interface AnonymousAnswer {
  id: string;
  choices: Choice[];
  formatted: string;
  player?: Player;
}

export interface Answer extends AnonymousAnswer {
  player: Player;
}
