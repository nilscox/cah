import { Answer } from '../../entities/Answer';
import { Game } from '../../entities/Game';
import { GameRepository } from '../../interfaces/GameRepository';

export class InMemoryGameRepository implements GameRepository {
  private games: Game[] = [];

  async findOne(_gameId: number): Promise<Game | undefined> {
    return this.games[0];
  }

  async save(game: Game): Promise<void> {
    if (!this.games.includes(game)) {
      this.games.push(game);
    }
  }

  async addAnswer(game: Game, answer: Answer): Promise<void> {
    if (!game.answers) {
      game.answers = [];
    }

    game.answers.push(answer);
  }
}
