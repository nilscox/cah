import _ from 'lodash';

import { PlayerRepository } from '../../../../application/interfaces/PlayerRepository';
import { Player } from '../../../../domain/models/Player';

export class InMemoryPlayerRepository implements PlayerRepository {
  private players: Player[] = [];

  reload(player?: Player) {
    if (player) {
      Object.assign(player, this.findPlayerById(player.id));
    }
  }

  async findAll(): Promise<Player[]> {
    return this.players;
  }

  async findPlayerById(id: string): Promise<Player | undefined> {
    return this.players.find((player) => player.id === id);
  }

  async findPlayerByNick(nick: string): Promise<Player | undefined> {
    return this.players.find((player) => player.nick === nick);
  }

  async save(players: Player | Player[]): Promise<void> {
    if (!Array.isArray(players)) {
      players = [players];
    }

    for (const player of players) {
      const idx = this.players.findIndex(({ id }) => id === player.id);
      const clone = _.cloneDeep(player);

      clone.dropEvents();

      if (idx < 0) {
        this.players.push(clone);
      } else {
        this.players[idx] = clone;
      }
    }
  }
}
