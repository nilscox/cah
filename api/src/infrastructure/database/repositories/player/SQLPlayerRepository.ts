import { Connection, Repository } from 'typeorm';

import { PlayerRepository } from '../../../../domain/interfaces/PlayerRepository';
import { Player } from '../../../../domain/models/Player';
import { PlayerEntity } from '../../entities/PlayerEntity';

export class SQLPlayerRepository implements PlayerRepository {
  private readonly repository: Repository<PlayerEntity>;

  constructor(connection: Connection) {
    this.repository = connection.getRepository(PlayerEntity);
  }

  async findAll(): Promise<Player[]> {
    const entities = await this.repository.find();

    return entities.map(PlayerEntity.toDomain);
  }

  async findPlayerById(id: string): Promise<Player | undefined> {
    const entity = await this.repository.findOne(id, { relations: ['cards'] });

    if (entity) {
      return PlayerEntity.toDomain(entity);
    }
  }

  async findPlayerByNick(nick: string): Promise<Player | undefined> {
    const entity = await this.repository.findOne({ nick }, { relations: ['cards'] });

    if (entity) {
      return PlayerEntity.toDomain(entity);
    }
  }

  async save(player: Player | Player[]): Promise<void> {
    const players = Array.isArray(player) ? player : [player];

    await this.repository.save(players.map(PlayerEntity.toPersistence));
  }
}
