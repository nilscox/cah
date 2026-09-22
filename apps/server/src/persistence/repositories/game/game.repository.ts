import { type Game as GameDto } from '@cah/shared';

import { type Game } from 'src/entities';

export interface GameRepository {
  query(id: string): Promise<GameDto>;

  findById(id: string): Promise<Game>;
  findByCode(code: string): Promise<Game>;
  insert(game: Game): Promise<void>;
  update(game: Game): Promise<void>;
}
