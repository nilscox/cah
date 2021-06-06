import { Answer } from '../../entities/Answer';
import { Game } from '../../entities/Game';
import { GameRepository } from '../../interfaces/GameRepository';

export class InMemoryGameRepository implements GameRepository {
  private games: Game[] = [];

  async createGame(_code: string): Promise<Game> {
    throw new Error('Method not implemented.');
  }

  async findById(_gameId: number): Promise<Game | undefined> {
    return this.games[0];
  }

  async save(game: Game): Promise<void> {
    if (!this.games.includes(game)) {
      this.games.push(game);
    }
  }

  async getAnswers(game: Game): Promise<Answer[]> {
    return game.answers!;
  }

  async addAnswer(game: Game, answer: Answer): Promise<void> {
    game.answers?.push(answer);
  }
}
