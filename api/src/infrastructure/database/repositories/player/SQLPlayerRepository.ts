import { Connection, Repository } from 'typeorm';

import { PlayerRepository } from '../../../../domain/interfaces/PlayerRepository';
import { Player } from '../../../../domain/models/Player';
import { ChoiceEntity } from '../../entities/ChoiceEntity';
import { PlayerEntity } from '../../entities/PlayerEntity';

export class SQLPlayerRepository implements PlayerRepository {
  private readonly repository: Repository<PlayerEntity>;
  private readonly choiceRepository: Repository<ChoiceEntity>;

  constructor(connection: Connection) {
    this.repository = connection.getRepository(PlayerEntity);
    this.choiceRepository = connection.getRepository(ChoiceEntity);
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
    const entity = await this.repository.findOne({ nick });

    if (entity) {
      return PlayerEntity.toDomain(entity);
    }
  }

  async save(player: Player | Player[]): Promise<void> {
    const players = Array.isArray(player) ? player : [player];

    await this.repository.save(players.map(PlayerEntity.toPersistence));

    // todo: is this necessary?
    // await this.choiceRepository.save(player.getCards());
  }
}
