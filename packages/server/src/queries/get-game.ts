import { Game } from '@cah/shared';
import { injectableClass } from 'ditox';

import { isStarted } from 'src/entities';
import { QueryHandler } from 'src/interfaces';
import { GameRepository, PlayerRepository, QuestionRepository } from 'src/persistence';
import { TOKENS } from 'src/tokens';

export type GetGameQuery = {
  gameId: string;
};

export class GetGameHandler implements QueryHandler<GetGameQuery, Game> {
  static inject = injectableClass(
    this,
    TOKENS.repositories.game,
    TOKENS.repositories.player,
    TOKENS.repositories.question
  );

  constructor(
    private readonly gameRepository: GameRepository,
    private readonly playerRepository: PlayerRepository,
    private readonly questionRepository: QuestionRepository
  ) {}

  async execute({ gameId }: GetGameQuery): Promise<Game> {
    const game = await this.gameRepository.findById(gameId);
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

      const question = await this.questionRepository.findById(game.questionId);

      result.question = {
        id: question.id,
        text: question.text,
      };
    }

    return result;
  }
}
