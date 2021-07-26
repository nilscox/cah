import { GameRepository } from '../../../../domain/interfaces/GameRepository';
import { Choice } from '../../../../domain/models/Choice';
import { Game } from '../../../../domain/models/Game';
import { Question } from '../../../../domain/models/Question';
import { Turn } from '../../../../domain/models/Turn';

export class InMemoryGameRepository implements GameRepository {
  private games = new Map<string, Game>();
  private questions = new Map<string, Question[]>();
  private choices = new Map<string, Choice[]>();
  private turns = new Map<string, Turn[]>();

  get allGames() {
    return [...this.games.values()];
  }

  async findAll(): Promise<Game[]> {
    return this.allGames;
  }

  async findGameById(id: string): Promise<Game | undefined> {
    return this.games.get(id);
  }

  async findGameByCode(code: string): Promise<Game | undefined> {
    return this.allGames.find((game) => game.code === code);
  }

  async findGameForPlayer(playerId: string): Promise<Game | undefined> {
    return this.allGames.find((game) => game.players.some((player) => player.id === playerId));
  }

  async addQuestions(gameId: string, questions: Question[]): Promise<void> {
    this.questions.set(gameId, questions);
  }

  async findNextAvailableQuestion(gameId: string): Promise<Question | undefined> {
    const game = this.games.get(gameId);

    const isAvailable = (question: Question) => {
      if (game?.question?.equals(question)) {
        return false;
      }

      return !this.getTurns(gameId).some((turn) => turn.question.equals(question));
    };

    return this.getQuestions(gameId).filter(isAvailable)?.[0];
  }

  async addChoices(gameId: string, choices: Choice[]): Promise<void> {
    this.choices.set(gameId, choices);
  }

  async findAvailableChoices(gameId: string): Promise<Choice[]> {
    const game = this.games.get(gameId);

    const isAvailable = (choice: Choice) => {
      if (game?.players?.some((player) => player.getCards().some((card) => card.equals(choice)))) {
        return false;
      }

      if (game?.answers?.some((answer) => answer.hasChoice(choice))) {
        return false;
      }

      return !this.getTurns(gameId).some((turn) => turn.answers.some((answer) => answer.hasChoice(choice)));
    };

    return this.getChoices(gameId).filter(isAvailable);
  }

  async addTurn(gameId: string, turn: Turn): Promise<void> {
    this.turns.set(gameId, [...this.getTurns(gameId), turn]);
  }

  getQuestions(gameId: string): Question[] {
    return this.questions.get(gameId) ?? [];
  }

  getChoices(gameId: string): Choice[] {
    return this.choices.get(gameId) ?? [];
  }

  getTurns(gameId: string): Turn[] {
    return this.turns.get(gameId) ?? [];
  }

  async save(game: Game): Promise<void> {
    this.games.set(game.id, game);
  }
}