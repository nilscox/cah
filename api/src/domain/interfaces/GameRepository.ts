import { Token } from 'typedi';

import { Answer } from '../entities/Answer';
import { Game } from '../entities/Game';

export const GameRepositoryToken = new Token('GameRepository');

export interface GameRepository {
  createGame(code: string): Promise<Game>;
  findOne(gameId: number): Promise<Game | undefined>;
  save(game: Game): Promise<void>;
  getAnswers(game: Game): Promise<Answer[]>;
  addAnswer(game: Game, answer: Answer): Promise<void>;
}
