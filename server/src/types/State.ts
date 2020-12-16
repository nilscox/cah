import { Question } from './Question';
import { Choice } from './Choice';
import { Player } from './Player';
import { Game, Language } from './Game';

type Data = {
  questions: Question[];
  choices: Choice[];
};

export interface State {
  data: Record<Language, Data>;
  players: Player[];
  games: Game[];
}
