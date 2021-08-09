import { AnonymousAnswerDto, AnswerDto, GameDto, TurnDto } from '../../../../shared/dtos';
import { Answer } from '../../domain/entities/Answer';
import { Choice } from '../../domain/entities/Choice';
import { Game, isStarted, StartedGame } from '../../domain/entities/Game';
import { Player } from '../../domain/entities/Player';
import { Turn } from '../../domain/entities/Turn';
import { GameGateway } from '../../domain/gateways/GameGateway';

import { HTTPAdapter } from './HTTPAdapter';

class DtoMapper {
  private static toAnswer(dto: AnonymousAnswerDto | AnswerDto, findPlayer: (nick: string) => Player): Answer {
    const answer: Answer = { ...dto } as Answer;

    if ('player' in dto) {
      answer.player = findPlayer(dto.player);
    }

    return answer;
  }

  static toGame(dto: GameDto): Game | StartedGame {
    const findPlayer = (nick: string) => dto.players.find((player) => player.nick === nick)!;

    const game: Game = {
      ...dto,
      creator: findPlayer(dto.creator),
      state: dto.gameState,
      turns: [],
    };

    if (isStarted(game)) {
      game.questionMaster = findPlayer(dto.questionMaster!);
      game.answers = dto.answers?.map((answer) => DtoMapper.toAnswer(answer, findPlayer)) ?? [];

      if (dto.winner) {
        game.winner = findPlayer(dto.winner);
      }
    }

    return game;
  }

  static toTurn(dto: TurnDto): Turn {
    return {
      number: dto.number,
      question: dto.question,
      answers: dto.answers.map((answer) => ({ ...answer, player: { nick: answer.player } as Player })),
      winner: { nick: dto.winner } as Player,
    };
  }
}

export class HTTPGameGateway implements GameGateway {
  constructor(private readonly http: HTTPAdapter) {}

  async fetchGame(gameId: string): Promise<Game> {
    const { body } = await this.http.get<GameDto>(`/game/${gameId}`);

    return DtoMapper.toGame(body);
  }

  async fetchTurns(gameId: string): Promise<Turn[]> {
    const { body } = await this.http.get<TurnDto[]>(`/game/${gameId}/turns`);

    return body.map(DtoMapper.toTurn);
  }

  async createGame(): Promise<Game> {
    const { body } = await this.http.post<GameDto>('/game');

    return DtoMapper.toGame(body);
  }

  async joinGame(code: string): Promise<Game> {
    const { body } = await this.http.post<GameDto>(`/game/${code}/join`);

    return DtoMapper.toGame(body);
  }

  async leaveGame(): Promise<void> {
    await this.http.post('/game/leave');
  }

  async startGame(questionMaster: Player, turns: number): Promise<void> {
    await this.http.post('/start', {
      questionMasterId: questionMaster.id,
      turns,
    });
  }

  async flushCards(): Promise<void> {
    await this.http.post('/flush-cards');
  }

  async answer(choices: Choice[]): Promise<void> {
    await this.http.post('/answer', { choicesIds: choices.map(({ id }) => id) });
  }

  async selectWinningAnswer(answer: Answer): Promise<void> {
    await this.http.post('/select', { answerId: answer.id });
  }

  async endCurrentTurn(): Promise<void> {
    await this.http.post('/next');
  }
}
