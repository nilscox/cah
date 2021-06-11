import { Answer } from '../../entities/Answer';
import { Game } from '../../entities/Game';
import { Player } from '../../entities/Player';
import { GameRepository } from '../../interfaces/GameRepository';

export class InMemoryGameRepository implements GameRepository {
  private game?: Game;

  async createGame(code: string): Promise<Game> {
    this.game = new Game();
    this.game.code = code;

    return this.game;
  }

  async findById(_gameId: number): Promise<Game | undefined> {
    return this.game;
  }

  async findByCode(_gameCode: string): Promise<Game | undefined> {
    throw new Error('Method not implemented.');
  }

  async save(game: Game): Promise<void> {
    this.game = game;
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
