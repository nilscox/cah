import { Player } from 'src/entities';
import { hasProperty } from 'src/utils/has-property';

import { InMemoryRepository } from '../../in-memory-repository';

import { PlayerRepository } from './player.repository';

export class InMemoryPlayerRepository extends InMemoryRepository<Player> implements PlayerRepository {
  async findAllByGameId(gameId: string): Promise<Player[]> {
    return this.filter(hasProperty('gameId', gameId));
  }

  async findByNick(nick: string): Promise<Player | undefined> {
    return this.find(hasProperty('nick', nick));
  }
}
