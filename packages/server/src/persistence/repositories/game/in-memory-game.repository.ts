import * as shared from '@cah/shared';

import { Game } from 'src/entities';

import { InMemoryRepository } from '../../in-memory-repository';

import { GameRepository } from './game.repository';

export class InMemoryGameRepository extends InMemoryRepository<Game> implements GameRepository {
  query(): Promise<shared.Game> {
    throw new Error('Method not implemented.');
  }

  async findById(gameId: string): Promise<Game> {
    const game = this.get(gameId);

    if (!game) {
      throw new Error('Game not found');
    }

    return game;
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
