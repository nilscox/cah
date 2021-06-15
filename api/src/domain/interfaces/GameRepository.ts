import { Token } from 'typedi';

import { Game } from '../entities/Game';
import { Player } from '../entities/Player';

export const GameRepositoryToken = new Token<GameRepository>('GameRepository');

export interface GameRepository {
  findOne(gameId: number): Promise<Game | undefined>;
  findByCode(gameCode: string): Promise<Game | undefined>;
  save(game: Game): Promise<void>;
  addPlayer(game: Game, player: Player): Promise<void>;
}
