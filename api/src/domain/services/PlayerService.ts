import { Inject, Service } from 'typedi';

import { Player } from '../entities/Player';
import { PlayerRepository, PlayerRepositoryToken } from '../interfaces/PlayerRepository';

@Service()
export class PlayerService {
  @Inject(PlayerRepositoryToken)
  private readonly playerRepository!: PlayerRepository;

  async findPlayer(playerId: number): Promise<Player> {
    const player = await this.playerRepository.findOne(playerId);

    if (!player) {
      throw new Error(`Player with id ${playerId} not found`);
    }

    return player;
  }
}
