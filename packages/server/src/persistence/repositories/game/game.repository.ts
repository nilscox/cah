import { Game } from 'src/entities';

export interface GameRepository {
  findById(id: string): Promise<Game>;
  findByCode(code: string): Promise<Game>;
  insert(game: Game): Promise<void>;
  update(game: Game): Promise<void>;
}
