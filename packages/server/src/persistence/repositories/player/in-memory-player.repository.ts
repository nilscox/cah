import { Player } from 'src/entities';

import { InMemoryRepository } from '../../in-memory-repository';

import { PlayerRepository } from './player.repository';

export class InMemoryPlayerRepository extends InMemoryRepository<Player> implements PlayerRepository {
  async findByNick(nick: string): Promise<Player | undefined> {
    return this.find((player) => player.nick === nick);
  }
}
