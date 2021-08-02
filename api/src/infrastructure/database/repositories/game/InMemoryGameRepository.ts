import _ from 'lodash';

import { GameRepository } from '../../../../application/interfaces/GameRepository';
import { Choice } from '../../../../domain/models/Choice';
import { Game } from '../../../../domain/models/Game';
import { Player } from '../../../../domain/models/Player';
import { Question } from '../../../../domain/models/Question';
import { Turn } from '../../../../domain/models/Turn';
import { InMemoryCache } from '../../InMemoryCache';

const ids = (arr: { id: string }[]) => arr.map(({ id }) => id);

export class InMemoryGameRepository implements GameRepository {
  private questions = new Map<string, Question[]>();
  private choices = new Map<string, Choice[]>();
  private turns = new Map<string, Turn[]>();

  private get games() {
    const games = this.cache.all(Game);

    for (const game of games) {
      game.players = this.cache.allInIds(Player, ids(game.players));
    }

    return games;
  }

  private find<Key extends keyof Game>(key: Key, value: Game[Key]) {
    return this.games.find((game) => game[key] === value);
  }

  constructor(private readonly cache: InMemoryCache) {}

  async save(game: Game): Promise<void> {
    const clone = _.cloneDeep(game);

    clone.dropEvents();
    this.cache.save(Game, clone);
  }

  async findAll(): Promise<Game[]> {
    return this.games;
  }

  async findGameById(id: string): Promise<Game | undefined> {
    return this.find('id', id);
  }

  async findGameByCode(code: string): Promise<Game | undefined> {
    return this.find('code', code);
  }

  async findGameForPlayer(playerId: string): Promise<Game | undefined> {
    const hasPlayer = (game: Game) => game.players.some((player) => player.id === playerId);

    return this.games.find(hasPlayer);
  }

  async addQuestions(gameId: string, questions: Question[]): Promise<void> {
    this.questions.set(gameId, questions);
  }

  async findNextAvailableQuestion(gameId: string): Promise<Question | undefined> {
    const game = await this.findGameById(gameId);

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
    return this.getChoices(gameId).filter((choice) => choice.available);
  }

  async markChoicesUnavailable(choiceIds: string[]): Promise<void> {
    for (const choice of Array.from(this.choices.values()).flat()) {
      if (choiceIds.includes(choice.id)) {
        choice.available = false;
      }
    }
  }

  async addTurn(gameId: string, turn: Turn): Promise<void> {
    this.turns.set(gameId, [...this.getTurns(gameId), turn]);
  }

  async findTurns(gameId: string): Promise<Turn[]> {
    return this.getTurns(gameId);
  }

  reload(game?: Game) {
    if (game) {
      Object.assign(game, this.find('id', game.id));
    }
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
}
