import { Choice } from '../../entities/Choice';
import { Player } from '../../entities/Player';
import { PlayerRepository } from '../../interfaces/PlayerRepository';

import { InMemoryRepository } from './InMemoryRepository';

export class InMemoryPlayerRepository extends InMemoryRepository<Player> implements PlayerRepository {
  async findByNick(playerNick: string): Promise<Player | undefined> {
    return this.get().find(({ nick }) => nick === playerNick);
  }

  createPlayer(_nick: string): Promise<Player> {
    throw new Error('Method not implemented.');
  }

  // TODO: don't mutate the player instance
  async addCards(player: Player, cards: Choice[]): Promise<void> {
    player.cards.push(...cards);
  }

  async removeCards(player: Player, cards: Choice[]): Promise<void> {
    player.cards = player.cards.filter((card) => !cards.includes(card));
  }
}
