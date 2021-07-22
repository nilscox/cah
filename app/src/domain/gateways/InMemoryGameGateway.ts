import { Answer } from '../../interfaces/entities/Answer';
import { Choice } from '../../interfaces/entities/Choice';
import { Game } from '../../interfaces/entities/Game';
import { Player } from '../../interfaces/entities/Player';
import { GameGateway } from '../../interfaces/gateways/GameGateway';
import { createGame } from '../../utils/factories';

export class InMemoryGameGateway implements GameGateway {
  async fetchGame(gameId: string): Promise<Game> {
    return createGame({ id: gameId });
  }

  async createGame(): Promise<Game> {
    return createGame({ code: 'OK42' });
  }

  async joinGame(gameCode: string): Promise<Game> {
    return createGame({ code: gameCode });
  }

  startGame(_questionMaster: Player, _turns: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  answer(_choices: Choice[]): Promise<void> {
    throw new Error('Method not implemented.');
  }

  selectWinningAnswer(_answer: Answer): Promise<void> {
    throw new Error('Method not implemented.');
  }

  endCurrentTurn(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
