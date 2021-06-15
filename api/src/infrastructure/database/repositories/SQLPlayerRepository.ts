import { EntityRepository, Repository } from 'typeorm';

import { PlayerRepository } from '../../../domain/interfaces/PlayerRepository';
import { ChoiceEntity } from '../entities/ChoiceEntity';
import { PlayerEntity } from '../entities/PlayerEntity';

@EntityRepository(PlayerEntity)
export class SQLPlayerRepository extends Repository<PlayerEntity> implements PlayerRepository {
  async findOne(playerId: number): Promise<PlayerEntity | undefined> {
    return this.findOne(playerId, { relations: ['cards'] });
  }

  async findByNick(nick: string): Promise<PlayerEntity | undefined> {
    return this.findOne({ nick });
  }

  async createPlayer(nick: string): Promise<PlayerEntity> {
    return this.save(this.create({ nick }));
  }

  async addCards(player: PlayerEntity, cards: ChoiceEntity[]): Promise<void> {
    player.cards.push(...cards);
    await this.save(player);
  }

  async removeCards(player: PlayerEntity, cards: ChoiceEntity[]): Promise<void> {
    player.cards = player.cards.filter((card) => !cards.find(({ id }) => id === card.id));
    await this.save(player);
  }
}
