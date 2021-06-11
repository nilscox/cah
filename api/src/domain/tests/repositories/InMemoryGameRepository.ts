import { Answer } from '../../entities/Answer';
import { Game } from '../../entities/Game';
import { Player } from '../../entities/Player';
import { GameRepository } from '../../interfaces/GameRepository';

export class InMemoryGameRepository implements GameRepository {
  private games: Game[] = [];

  async createGame(_code: string): Promise<Game> {
    throw new Error('Method not implemented.');
  }

  async findById(_gameId: number): Promise<Game | undefined> {
    return this.games[0];
  }

  async findByCode(_gameCode: string): Promise<Game | undefined> {
    throw new Error('Method not implemented.');
  }

  async save(game: Game): Promise<void> {
    if (!this.games.includes(game)) {
      this.games.push(game);
    }
  }

  async addPlayer(_game: Game, _player: Player): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async getAnswers(game: Game): Promise<Answer[]> {
    return game.answers!;
  }

  async addAnswer(game: Game, answer: Answer): Promise<void> {
    game.answers?.push(answer);
  }
}
