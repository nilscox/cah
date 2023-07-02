import { Player } from 'src/entities';
import { hasProperty } from 'src/utils/has-property';

import { InMemoryRepository } from '../../in-memory-repository';

import { PlayerRepository } from './player.repository';

export class InMemoryPlayerRepository extends InMemoryRepository<Player> implements PlayerRepository {
  async findByIdOrFail(id: string): Promise<Player> {
    const item = this.get(id);

    if (!item) {
      throw new Error('Player not found');
    }

    return Promise.resolve(item);
  }

  async findAllByGameId(gameId: string): Promise<Player[]> {
    return this.filter(hasProperty('gameId', gameId));
  }

  async findByNick(nick: string): Promise<Player | undefined> {
    return this.find(hasProperty('nick', nick));
  }

  async insert(player: Player): Promise<void> {
    return this.set(player);
  }

  async update(player: Player): Promise<void> {
    return this.set(player);
  }
}
