import { getRepository, Repository } from 'typeorm';

import { PlayerRepository } from '../../../domain/interfaces/PlayerRepository';
import { ChoiceEntity } from '../entities/ChoiceEntity';
import { PlayerEntity } from '../entities/PlayerEntity';

export class SQLPlayerRepository implements PlayerRepository {
  private repo: Repository<PlayerEntity>;

  constructor() {
    this.repo = getRepository(PlayerEntity);
  }

  async findOne(playerId: number): Promise<PlayerEntity | undefined> {
    return this.repo.findOne(playerId, { relations: ['cards'] });
  }

  async findByNick(nick: string): Promise<PlayerEntity | undefined> {
    return this.repo.findOne({ nick });
  }

  async createPlayer(nick: string): Promise<PlayerEntity> {
    return this.repo.save(this.repo.create({ nick }));
  }

  async save(player: PlayerEntity): Promise<void> {
    await this.repo.save(player);
  }

  async addCards(player: PlayerEntity, cards: ChoiceEntity[]): Promise<void> {
    player.cards.push(...cards);
    await this.repo.save(player);
  }

  async removeCards(player: PlayerEntity, cards: ChoiceEntity[]): Promise<void> {
    player.cards = player.cards.filter((card) => !cards.find(({ id }) => id === card.id));
    await this.repo.save(player);
  }
}
