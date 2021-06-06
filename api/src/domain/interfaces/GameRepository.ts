import { Token } from 'typedi';

import { Answer } from '../entities/Answer';
import { Game } from '../entities/Game';
import { Player } from '../entities/Player';

export const GameRepositoryToken = new Token('GameRepository');

export interface GameRepository {
  createGame(code: string): Promise<Game>;
  findById(gameId: number): Promise<Game | undefined>;
  findByCode(gameCode: string): Promise<Game | undefined>;
  save(game: Game): Promise<void>;
  addPlayer(game: Game, player: Player): Promise<void>;
  getAnswers(game: Game): Promise<Answer[]>;
  addAnswer(game: Game, answer: Answer): Promise<void>;
}
