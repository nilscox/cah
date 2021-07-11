import { Inject, Service } from 'typedi';

import { Player } from '../entities/Player';
import { PlayerRepository, PlayerRepositoryToken } from '../interfaces/PlayerRepository';

@Service()
export class QueryPlayer {
  @Inject(PlayerRepositoryToken)
  private readonly playerRepository!: PlayerRepository;

  queryPlayer(playerId: number): Promise<Player | undefined> {
    return this.playerRepository.findOne(playerId);
  }
}
