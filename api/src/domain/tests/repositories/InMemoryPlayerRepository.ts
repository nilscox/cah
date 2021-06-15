import { Choice } from '../../entities/Choice';
import { Player } from '../../entities/Player';
import { PlayerRepository } from '../../interfaces/PlayerRepository';

export class InMemoryPlayerRepository implements PlayerRepository {
  private players: Player[] = [];

  setPlayers(players: Player[]): void {
    this.players = players;
  }

  async findOne(playerId: number): Promise<Player | undefined> {
    return this.players.find(({ id }) => id === playerId);
  }

  async findByNick(playerNick: string): Promise<Player | undefined> {
    return this.players.find(({ nick }) => nick === playerNick);
  }

  async save(player: Player): Promise<void> {
    if (this.players[player.id]) {
      this.players[player.id] = player;
    } else {
      player.id = this.players.length;
      this.players.push(player);
    }
  }

  async addCards(player: Player, cards: Choice[]): Promise<void> {
    player.cards.push(...cards);
  }

  async removeCards(player: Player, cards: Choice[]): Promise<void> {
    player.cards = player.cards.filter((card) => !cards.includes(card));
  }
}
