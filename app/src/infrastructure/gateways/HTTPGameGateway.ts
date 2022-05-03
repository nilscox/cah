import { AnswerDto, GameDto, PlayerId, StartedGameDto, TurnDto } from '../../../../shared/dtos';
import { AnonymousAnswer, Answer } from '../../domain/entities/Answer';
import { Choice } from '../../domain/entities/Choice';
import { Game, isStarted, StartedGame } from '../../domain/entities/game';
import { Player } from '../../domain/entities/player';
import { Turn } from '../../domain/entities/Turn';
import { GameGateway } from '../../domain/gateways/GameGateway';

import { HTTPAdapter } from './HTTPAdapter';

type FindPlayer = (player: PlayerId) => Player;

class DtoMapper {
  private static toAnswer(dto: AnswerDto, findPlayer: FindPlayer): Answer {
    const answer: AnonymousAnswer = {
      id: dto.id,
      choices: dto.choices,
      formatted: dto.formatted,
    };

    if (dto.player) {
      answer.player = findPlayer(dto.player);
    }

    return answer as Answer;
  }

  static toGame(dto: GameDto | StartedGameDto): Game | StartedGame {
    const findPlayer: FindPlayer = (id: string) => dto.players.find((player) => player.id === id)!;

    const game: Game | StartedGame = {
      ...dto,
      creator: findPlayer(dto.creator),
      state: dto.gameState,
      turns: [],
    };

    if (isStarted(game)) {
      const { questionMaster, answers, winner } = dto as StartedGameDto;

      game.questionMaster = findPlayer(questionMaster);
      game.answers = answers.map((answer) => DtoMapper.toAnswer(answer, findPlayer)) ?? [];

      if (winner) {
        game.winner = findPlayer(winner);
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

  async startGame(questionMaster: Player | null, turns: number): Promise<void> {
    await this.http.post('/start', {
      questionMasterId: questionMaster?.id ?? null,
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
