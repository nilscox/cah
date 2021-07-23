import { GameDto } from '../../../../shared/dtos';
import { Answer } from '../../domain/entities/Answer';
import { Choice } from '../../domain/entities/Choice';
import { Game } from '../../domain/entities/Game';
import { Player } from '../../domain/entities/Player';
import { GameGateway } from '../../domain/gateways/GameGateway';

import { HTTPAdapter } from './HTTPAdapter';

export class HTTPGameGateway implements GameGateway {
  constructor(private readonly http: HTTPAdapter) {}

  private dtoToGame(dto: GameDto) {
    return {
      ...dto,
      state: dto.gameState,
    };
  }

  async fetchGame(gameId: string): Promise<Game> {
    const { body } = await this.http.get<GameDto>(`/game/${gameId}`);

    return this.dtoToGame(body);
  }

  async createGame(): Promise<Game> {
    const { body } = await this.http.post<GameDto>('/game');

    return this.dtoToGame(body);
  }

  async joinGame(code: string): Promise<Game> {
    const { body } = await this.http.post<GameDto>(`/game/${code}/join`);

    return this.dtoToGame(body);
  }

  async startGame(questionMaster: Player, turns: number): Promise<void> {
    await this.http.post('/start', {
      questionMasterId: questionMaster.id,
      turns,
    });
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
