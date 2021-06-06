import { Choice } from '../../entities/Choice';
import { Player } from '../../entities/Player';
import { PlayerRepository } from '../../interfaces/PlayerRepository';

export class InMemoryPlayerRepository implements PlayerRepository {
  async findById(_id: number): Promise<Player | undefined> {
    throw new Error('Method not implemented.');
  }

  async findByNick(_nick: string): Promise<Player | undefined> {
    throw new Error('Method not implemented.');
  }

  async createPlayer(_nick: string): Promise<Player> {
    throw new Error('Method not implemented.');
  }

  async addCards(player: Player, cards: Choice[]): Promise<void> {
    player.cards.push(...cards);
  }

  async removeCards(player: Player, cards: Choice[]): Promise<void> {
    player.cards = player.cards.filter((card) => !cards.includes(card));
  }
}
