import { Game } from '@cah/shared';
import { injectableClass } from 'ditox';

import { QueryHandler } from 'src/interfaces';
import { GameRepository } from 'src/persistence';
import { TOKENS } from 'src/tokens';

export type GetGameQuery = {
  gameId: string;
};

export class GetGameHandler implements QueryHandler<GetGameQuery, Game> {
  static inject = injectableClass(this, TOKENS.repositories.game);

  constructor(private readonly gameRepository: GameRepository) {}

  async execute({ gameId }: GetGameQuery): Promise<Game> {
    return this.gameRepository.query(gameId);
  }
}
