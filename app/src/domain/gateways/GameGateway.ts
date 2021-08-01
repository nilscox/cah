import { AnonymousAnswer } from '../entities/Answer';
import { Choice } from '../entities/Choice';
import { Game } from '../entities/Game';
import { Player } from '../entities/Player';
import { Turn } from '../entities/Turn';

export interface GameGateway {
  fetchGame(gameId: string): Promise<Game | undefined>;
  fetchTurns(gameId: string): Promise<Turn[]>;
  createGame(): Promise<Game>;
  joinGame(gameCode: string): Promise<Game>;
  leaveGame(): Promise<void>;
  startGame(questionMaster: Player, turns: number): Promise<void>;
  flushCards(): Promise<void>;
  answer(choices: Choice[]): Promise<void>;
  selectWinningAnswer(answer: AnonymousAnswer): Promise<void>;
  endCurrentTurn(): Promise<void>;
}
