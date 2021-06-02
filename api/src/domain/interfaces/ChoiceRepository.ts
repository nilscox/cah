import { Choice } from '../entities/Choice';
import { Game } from '../entities/Game';

export interface ChoiceRepository {
  createChoices(game: Game, choices: Choice[]): Promise<void>;
  pickRandomChoices(count: number): Promise<Choice[]>;
  getAvailableChoices(game: Game): Promise<Choice[]>;
}
