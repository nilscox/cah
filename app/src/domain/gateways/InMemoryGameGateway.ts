import { Answer } from '../../interfaces/entities/Answer';
import { Choice } from '../../interfaces/entities/Choice';
import { Game } from '../../interfaces/entities/Game';
import { Player } from '../../interfaces/entities/Player';
import { GameGateway } from '../../interfaces/gateways/GameGateway';

export class InMemoryGameGateway implements GameGateway {
  fetchGame(gameId: string): Promise<Game> {
    throw new Error('Method not implemented.');
  }

  createGame(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  joinGame(gameCode: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  startGame(questionMaster: Player, turns: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  answer(choices: Choice[]): Promise<void> {
    throw new Error('Method not implemented.');
  }

  selectWinningAnswer(answer: Answer): Promise<void> {
    throw new Error('Method not implemented.');
  }

  endCurrentTurn(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
