import { Token } from 'typedi';

import { Game } from '../entities/Game';

export const GameRepositoryToken = new Token('GameRepository');

export interface GameRepository {
  findOne(gameId: number): Promise<Game | undefined>;
  save(game: Game): Promise<void>;
}
