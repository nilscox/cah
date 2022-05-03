import { GameDto, TurnDto } from '../../../../shared/dtos';
import { AnonymousAnswer } from '../entities/Answer';
import { Choice } from '../entities/Choice';
import { Player } from '../entities/player';

export interface GameGateway {
  fetchGame(gameId: string): Promise<GameDto | undefined>;
  fetchTurns(gameId: string): Promise<TurnDto[]>;
  createGame(): Promise<GameDto>;
  joinGame(gameCode: string): Promise<GameDto>;
  leaveGame(): Promise<void>;
  startGame(questionMaster: Player | null, turns: number): Promise<void>;
  flushCards(): Promise<void>;
  answer(choices: Choice[]): Promise<void>;
  selectWinningAnswer(answer: AnonymousAnswer): Promise<void>;
  endCurrentTurn(): Promise<void>;
}
