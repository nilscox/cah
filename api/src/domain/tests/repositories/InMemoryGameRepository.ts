import _ from 'lodash';

import { Answer } from '../../entities/Answer';
import { Game } from '../../entities/Game';
import { Player } from '../../entities/Player';
import { GameRepository } from '../../interfaces/GameRepository';

export class InMemoryGameRepository implements GameRepository {
  private games: Game[] = [];
  private answers: Record<number, Answer[]> = {};

  async findAll(): Promise<Game[]> {
    return this.games;
  }

  async findOne(gameId: number): Promise<Game | undefined> {
    return this.games[gameId];
  }

  async findByCode(gameCode: string): Promise<Game | undefined> {
    throw new Error('Method not implemented.');
  }

  async addPlayer(game: Game, player: Player): Promise<void> {
    game.players.push(player);
  }

  async save(game: Game) {
    if (this.games[game.id]) {
      this.games[game.id] = game;
    } else {
      game.id = this.games.length;
      this.games.push(game);
    }
  }

  async addAnswer(game: Game, answer: Answer): Promise<void> {
    this.answers[game.id] = [...(await this.getAnswers(game)), answer];
  }

  async getAnswers(game: Game): Promise<Answer[]> {
    return _.sortBy(this.answers[game.id] ?? [], ['place']);
  }
}
