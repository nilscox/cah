import { getRepository } from 'typeorm';

import { Game } from '../../../domain/entities/Game';
import { GameRepository } from '../../../domain/interfaces/GameRepository';
import { GameEntity } from '../entities/GameEntity';

export class SQLGameRepository implements GameRepository {
  private readonly repo = getRepository(GameEntity);

  async findOne(gameId: number): Promise<Game | undefined> {
    return this.repo.findOne(gameId);
  }

  async save(game: GameEntity): Promise<void> {
    await this.repo.save(game);
  }
}
