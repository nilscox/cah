import { Answer } from '../../interfaces/entities/Answer';
import { Choice } from '../../interfaces/entities/Choice';
import { Game, GameState, PlayState } from '../../interfaces/entities/Game';
import { Player } from '../../interfaces/entities/Player';
import { GameGateway } from '../../interfaces/gateways/GameGateway';

import { HTTPAdapter } from './HTTPAdapter';

interface GameDto {
  id: string;
  code: string;
  players: Array<{
    id: string;
    gameId?: string;
    nick: string;
    isConnected: boolean;
  }>;
  gameState: GameState;
  playState?: PlayState;
  questionMaster?: string;
  question?: {
    text: string;
    blanks?: number[];
    numberOfBlanks: number;
    formatted: string;
  };
  answers?: Array<{
    id: string;
    player?: string;
    choices: string[];
    formatted: string;
  }>;
  winner?: string;
}

export class HTTPGameGateway implements GameGateway {
  constructor(private readonly http: HTTPAdapter) {}

  async fetchGame(gameId: string): Promise<Game> {
    const { body } = await this.http.get<GameDto>(`/game/${gameId}`);

    return {
      ...body,
      state: body.gameState,
    };
  }

  async createGame(): Promise<Game> {
    const { body } = await this.http.post<Game>('/game');

    return body;
  }

  async joinGame(code: string): Promise<Game> {
    const { body } = await this.http.post<Game>(`/game/${code}/join`);

    return body;
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
