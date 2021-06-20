import { Inject, Service } from 'typedi';

import { Player } from '../entities/Player';
import { EntityNotFoundError } from '../errors/EntityNotFoundError';
import { PlayerRepository, PlayerRepositoryToken } from '../interfaces/PlayerRepository';

@Service()
export class PlayerService {
  @Inject(PlayerRepositoryToken)
  private readonly playerRepository!: PlayerRepository;

  async findPlayer(playerId: number): Promise<Player> {
    const player = await this.playerRepository.findOne(playerId);

    if (!player) {
      throw new EntityNotFoundError('player', 'id', JSON.stringify(playerId));
    }

    return player;
  }
}
