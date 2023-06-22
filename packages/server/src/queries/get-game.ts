import { Game } from '@cah/shared';

import { isStarted } from 'src/entities';
import { QueryHandler } from 'src/interfaces';
import { GameRepository, PlayerRepository, QuestionRepository } from 'src/persistence';

export type GetGameQuery = {
  gameId: string;
};

export class GetGameHandler implements QueryHandler<GetGameQuery, Game> {
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly playerRepository: PlayerRepository,
    private readonly questionRepository: QuestionRepository
  ) {}

  async execute({ gameId }: GetGameQuery): Promise<Game> {
    const game = await this.gameRepository.findByIdOrFail(gameId);
    const players = await this.playerRepository.findAllByGameId(gameId);

    const result: Game = {
      id: game.id,
      code: game.code,
      state: game.state,
      players: players.map((player) => ({
        id: player.id,
        nick: player.nick,
      })),
    };

    if (isStarted(game)) {
      result.questionMasterId = game.questionMasterId;

      const question = await this.questionRepository.findByIdOrFail(game.questionId);

      result.question = {
        id: question.id,
        text: question.text,
      };
    }

    return result;
  }
}
