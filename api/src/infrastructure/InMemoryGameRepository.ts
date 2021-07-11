import { GameRepository } from '../domain/interfaces/GameRepository';
import { Choice } from '../domain/models/Choice';
import { Game } from '../domain/models/Game';
import { Question } from '../domain/models/Question';

export class InMemoryGameRepository implements GameRepository {
  private games = new Map<string, Game>();
  private questions = new Map<string, Question[]>();
  private choices = new Map<string, Choice[]>();

  async findGameById(id: string): Promise<Game | undefined> {
    return this.games.get(id);
  }

  async findGameForPlayer(playerId: string): Promise<Game | undefined> {
    return [...this.games.values()].find((game) => game.players.some((player) => player.id === playerId));
  }

  async addQuestions(gameId: string, questions: Question[]): Promise<void> {
    this.questions.set(gameId, questions);
  }

  async addChoices(gameId: string, choices: Choice[]): Promise<void> {
    this.choices.set(gameId, choices);
  }

  getQuestions(gameId: string): Question[] {
    return this.questions.get(gameId) ?? [];
  }

  getChoices(gameId: string): Choice[] {
    return this.choices.get(gameId) ?? [];
  }

  async save(game: Game): Promise<void> {
    this.games.set(game.id, game);
  }
}
