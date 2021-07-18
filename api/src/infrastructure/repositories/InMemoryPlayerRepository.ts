import { PlayerRepository } from '../../domain/interfaces/PlayerRepository';
import { Player } from '../../domain/models/Player';

export class InMemoryPlayerRepository implements PlayerRepository {
  private players = new Map<string, Player>();

  async findPlayerById(id: string): Promise<Player | undefined> {
    return this.players.get(id);
  }

  async findPlayerByNick(nick: string): Promise<Player | undefined> {
    return [...this.players.values()].find((player) => player.nick === nick);
  }

  async save(player: Player | Player[]): Promise<void> {
    if (Array.isArray(player)) {
      await Promise.all(player.map((player) => this.save(player)));
    } else {
      this.players.set(player.id, player);
    }
  }
}
