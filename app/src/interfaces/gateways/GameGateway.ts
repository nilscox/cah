import { Answer } from '../entities/Answer';
import { Choice } from '../entities/Choice';
import { Game } from '../entities/Game';
import { Player } from '../entities/Player';

export interface GameGateway {
  fetchGame(gameId: string): Promise<Game>;
  createGame(): Promise<void>;
  joinGame(gameCode: string): Promise<void>;
  startGame(questionMaster: Player, turns: number): Promise<void>;
  answer(choices: Choice[]): Promise<void>;
  selectWinningAnswer(answer: Answer): Promise<void>;
  endCurrentTurn(): Promise<void>;
}
