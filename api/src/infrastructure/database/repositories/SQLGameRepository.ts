import { getRepository } from 'typeorm';

import { Game } from '../../../domain/entities/Game';
import { GameRepository } from '../../../domain/interfaces/GameRepository';
import { AnswerEntity } from '../entities/AnswerEntity';
import { GameEntity } from '../entities/GameEntity';

export class SQLGameRepository implements GameRepository {
  private readonly repo = getRepository(GameEntity);
  private readonly answerRepository = getRepository(AnswerEntity);

  async createGame(code: string): Promise<Game> {
    return this.repo.save(this.repo.create({ code }));
  }

  async findById(gameId: number): Promise<Game | undefined> {
    return this.repo.findOne(gameId);
  }

  async save(game: GameEntity): Promise<void> {
    await this.repo.save(game);
  }

  async getAnswers(game: GameEntity): Promise<AnswerEntity[]> {
    const result = await this.repo
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.answers', 'answer')
      .leftJoinAndSelect('answer.player', 'player')
      .where({ id: game.id })
      .getOneOrFail();

    return result.answers!;
  }

  async addAnswer(game: GameEntity, answer: AnswerEntity): Promise<void> {
    await this.answerRepository.update(answer.id, { game });
  }
}
