import { Answer } from '../entities/Answer';
import { Choice } from '../entities/Choice';
import { Game } from '../entities/Game';
import { Player } from '../entities/Player';

export interface GameGateway {
  fetchGame(gameId: string): Promise<Game | undefined>;
  createGame(): Promise<Game>;
  joinGame(gameCode: string): Promise<Game>;
  startGame(questionMaster: Player, turns: number): Promise<void>;
  answer(choices: Choice[]): Promise<void>;
  selectWinningAnswer(answer: Answer): Promise<void>;
  endCurrentTurn(): Promise<void>;
}
