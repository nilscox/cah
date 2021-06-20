import _ from 'lodash';

import { Answer } from '../../entities/Answer';
import { Game } from '../../entities/Game';
import { Player } from '../../entities/Player';
import { GameRepository } from '../../interfaces/GameRepository';

import { InMemoryRepository } from './InMemoryRepository';

export class InMemoryGameRepository extends InMemoryRepository<Game> implements GameRepository {
  private answers: Record<number, Answer[]> = {};

  async findByCode(gameCode: string): Promise<Game | undefined> {
    throw new Error('Method not implemented.');
  }

  async addPlayer(game: Game, player: Player): Promise<void> {
    game.players.push(player);
  }

  async addAnswer(game: Game, answer: Answer): Promise<void> {
    this.answers[game.id] = [...(await this.getAnswers(game)), answer];
  }

  async getAnswers(game: Game): Promise<Answer[]> {
    return _.sortBy(this.answers[game.id] ?? [], ['place']);
  }
}
