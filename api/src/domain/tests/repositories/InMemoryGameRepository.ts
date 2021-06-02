import { Game } from '../../entities/Game';
import { GameRepository } from '../../interfaces/GameRepository';

export class InMemoryGameRepository implements GameRepository {
  private games: Game[] = [];

  async save(game: Game): Promise<void> {
    if (!this.games.includes(game)) {
      this.games.push(game);
    }
  }
}
