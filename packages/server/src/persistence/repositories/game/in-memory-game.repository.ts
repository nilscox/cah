import { Game } from 'src/entities';

import { InMemoryRepository } from '../../in-memory-repository';

import { GameRepository } from './game.repository';

export class InMemoryGameRepository extends InMemoryRepository<Game> implements GameRepository {
  async findByIdOrFail(id: string): Promise<Game> {
    const item = this.get(id);

    if (!item) {
      throw new Error('Game not found');
    }

    return Promise.resolve(item);
  }

  async findByCode(code: string): Promise<Game> {
    const game = this.find((game) => game.code === code);

    assert(game, `game with code "${code}" not found`);

    return game;
  }

  async insert(game: Game): Promise<void> {
    this.set(game);
  }

  async update(game: Game): Promise<void> {
    this.set(game);
  }
}
