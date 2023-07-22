import { Player } from '@cah/shared';
import { injectableClass } from 'ditox';

import { QueryHandler } from 'src/interfaces';
import { PlayerRepository } from 'src/persistence';
import { TOKENS } from 'src/tokens';

export type GetPlayerQuery = {
  playerId: string;
};

export class GetPlayerHandler implements QueryHandler<GetPlayerQuery, Player> {
  static inject = injectableClass(this, TOKENS.repositories.player);

  constructor(private readonly playerRepository: PlayerRepository) {}

  async execute({ playerId }: GetPlayerQuery): Promise<Player> {
    return this.playerRepository.query(playerId);
  }
}
