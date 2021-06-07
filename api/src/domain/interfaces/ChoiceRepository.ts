import { Token } from 'typedi';

import { Choice } from '../entities/Choice';
import { Game } from '../entities/Game';

export const ChoiceRepositoryToken = new Token<ChoiceRepository>('ChoiceRepository');

export interface ChoiceRepository {
  findByIds(ids: number[]): Promise<Choice[]>;
  createChoices(game: Game, choices: Omit<Choice, 'id'>[]): Promise<void>;
  pickRandomChoices(count: number): Promise<Choice[]>;
  getAvailableChoices(game: Game): Promise<Choice[]>;
}
