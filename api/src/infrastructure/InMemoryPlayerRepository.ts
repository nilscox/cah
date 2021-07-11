import { PlayerRepository } from '../domain/interfaces/PlayerRepository';
import { Player } from '../domain/models/Player';

export class InMemoryPlayerRepository implements PlayerRepository {
  private players = new Map<string, Player>();

  async findPlayerById(id: string): Promise<Player | undefined> {
    return this.players.get(id);
  }

  async save(player: Player): Promise<void> {
    this.players.set(player.id, player);
  }
}
