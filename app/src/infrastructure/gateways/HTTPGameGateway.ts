import { AnonymousAnswerDto, AnswerDto, GameDto } from '../../../../shared/dtos';
import { AnonymousAnswer, Answer } from '../../domain/entities/Answer';
import { Choice } from '../../domain/entities/Choice';
import { Game, isStarted, StartedGame } from '../../domain/entities/Game';
import { Player } from '../../domain/entities/Player';
import { GameGateway } from '../../domain/gateways/GameGateway';

import { HTTPAdapter } from './HTTPAdapter';

class DtoMapper {
  private static toAnswer(
    dto: AnonymousAnswerDto | AnswerDto,
    findPlayer: (nick: string) => Player,
  ): AnonymousAnswer | Answer {
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
      state: dto.gameState,
    };

    if (isStarted(game)) {
      game.questionMaster = findPlayer(dto.questionMaster!);
      game.answers = dto.answers?.map((answer) => DtoMapper.toAnswer(answer, findPlayer)) ?? [];
    }

    return game;
  }
}

export class HTTPGameGateway implements GameGateway {
  constructor(private readonly http: HTTPAdapter) {}

  async fetchGame(gameId: string): Promise<Game> {
    const { body } = await this.http.get<GameDto>(`/game/${gameId}`);

    return DtoMapper.toGame(body);
  }

  async createGame(): Promise<Game> {
    const { body } = await this.http.post<GameDto>('/game');

    return DtoMapper.toGame(body);
  }

  async joinGame(code: string): Promise<Game> {
    const { body } = await this.http.post<GameDto>(`/game/${code}/join`);

    return DtoMapper.toGame(body);
  }

  async startGame(questionMaster: Player, turns: number): Promise<void> {
    await this.http.post('/start', {
      questionMasterId: questionMaster.id,
      turns,
    });
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
