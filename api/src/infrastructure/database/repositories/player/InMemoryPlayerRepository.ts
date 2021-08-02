import _ from 'lodash';

import { PlayerRepository } from '../../../../application/interfaces/PlayerRepository';
import { Player } from '../../../../domain/models/Player';
import { InMemoryCache } from '../../InMemoryCache';

export class InMemoryPlayerRepository implements PlayerRepository {
  get players() {
    return this.cache.all(Player);
  }

  private find<Key extends keyof Player>(key: Key, value: Player[Key]) {
    return this.players.find((player) => player[key] === value);
  }

  constructor(private readonly cache: InMemoryCache) {}

  async save(players: Player | Player[]): Promise<void> {
    if (!Array.isArray(players)) {
      players = [players];
    }

    for (const player of players) {
      const clone = _.cloneDeep(player);

      clone.dropEvents();
      this.cache.save(Player, clone);
    }
  }

  async findAll(): Promise<Player[]> {
    return this.players;
  }

  async findPlayerById(id: string): Promise<Player | undefined> {
    return this.find('id', id);
  }

  async findPlayerByNick(nick: string): Promise<Player | undefined> {
    return this.find('nick', nick);
  }

  reload(player?: Player) {
    if (player) {
      Object.assign(player, this.find('id', player.id));
    }
  }
}
