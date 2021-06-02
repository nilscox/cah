import { getRepository } from 'typeorm';

import { GameRepository } from '../../../domain/interfaces/GameRepository';
import { GameEntity } from '../entities/GameEntity';

export class SQLGameRepository implements GameRepository {
  private readonly repo = getRepository(GameEntity);

  async save(game: GameEntity): Promise<void> {
    await this.repo.save(game);
  }
}
