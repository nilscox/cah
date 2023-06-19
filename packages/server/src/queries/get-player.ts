import { Player } from '@cah/shared';

import { QueryHandler } from 'src/interfaces';
import { PlayerRepository } from 'src/persistence';

export type GetPlayerQuery = {
  playerId: string;
};

export class GetPlayerHandler implements QueryHandler<GetPlayerQuery, Player> {
  constructor(private readonly playerRepository: PlayerRepository) {}

  async execute({ playerId }: GetPlayerQuery): Promise<Player> {
    return this.playerRepository.findByIdOrFail(playerId);
  }
}
