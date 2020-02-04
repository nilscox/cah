import { Question } from './Question';
import { Choice } from './Choice';
import { Player } from './Player';
import { Game } from './Game';

export interface State {

  data: {
    questions: Question[];
    choices: Choice[];
  };

  players: Player[];
  games: Game[];
}
