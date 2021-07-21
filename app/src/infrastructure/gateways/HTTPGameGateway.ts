import { Answer } from '../../interfaces/entities/Answer';
import { Choice } from '../../interfaces/entities/Choice';
import { Game } from '../../interfaces/entities/Game';
import { Player } from '../../interfaces/entities/Player';
import { GameGateway } from '../../interfaces/gateways/GameGateway';

import { HTTPAdapter } from './HTTPAdapter';

export class HTTPGameGateway implements GameGateway {
  constructor(private readonly http: HTTPAdapter) {}

  async fetchGame(gameId: string): Promise<Game> {
    const { body } = await this.http.get<Game>(`/game/${gameId}`);

    return body;
  }

  async createGame(): Promise<Game> {
    const { body } = await this.http.post<Game>('/game');

    return body;
  }

  async joinGame(code: string): Promise<Game> {
    const { body } = await this.http.post<Game>(`/game/${code}/join`);

    return body;
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
