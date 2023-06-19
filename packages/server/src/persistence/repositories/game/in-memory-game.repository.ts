import { Game } from 'src/entities';

import { InMemoryRepository } from '../../in-memory-repository';

import { GameRepository } from './game.repository';

export class InMemoryGameRepository extends InMemoryRepository<Game> implements GameRepository {
  async findByCode(code: string): Promise<Game> {
    const game = this.find((game) => game.code === code);

    assert(game, `game with code "${code}" not found`);

    return game;
  }
}
