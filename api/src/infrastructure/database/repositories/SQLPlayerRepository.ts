import { EntityRepository, Repository } from 'typeorm';

import { PlayerRepository } from '../../../domain/interfaces/PlayerRepository';
import { ChoiceEntity } from '../entities/ChoiceEntity';
import { PlayerEntity } from '../entities/PlayerEntity';

@EntityRepository(PlayerEntity)
export class SQLPlayerRepository extends Repository<PlayerEntity> implements PlayerRepository {
  async addCards(player: PlayerEntity, cards: ChoiceEntity[]): Promise<void> {
    player.cards.push(...cards);
    await this.save(player);
  }

  async removeCards(player: PlayerEntity, cards: ChoiceEntity[]): Promise<void> {
    player.cards = player.cards.filter((card) => !cards.includes(card));
    await this.save(player);
  }
}
