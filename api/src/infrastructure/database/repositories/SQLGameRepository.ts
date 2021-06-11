import { getRepository } from 'typeorm';

import { Game } from '../../../domain/entities/Game';
import { GameRepository } from '../../../domain/interfaces/GameRepository';
import { AnswerEntity } from '../entities/AnswerEntity';
import { GameEntity } from '../entities/GameEntity';
import { PlayerEntity } from '../entities/PlayerEntity';

export class SQLGameRepository implements GameRepository {
  private readonly repo = getRepository(GameEntity);
  private readonly answerRepository = getRepository(AnswerEntity);
  private readonly playerRepository = getRepository(PlayerEntity);

  async createGame(code: string): Promise<Game> {
    return this.repo.save(this.repo.create({ code }));
  }

  async findById(gameId: number): Promise<Game | undefined> {
    return this.repo.findOne(gameId, { relations: ['players', 'players.cards'] });
  }

  async findByCode(code: string): Promise<Game | undefined> {
    return this.repo.findOne({ code });
  }

  async save(game: GameEntity): Promise<void> {
    await this.repo.save(game);
  }

  async addPlayer(game: GameEntity, player: PlayerEntity): Promise<void> {
    await this.playerRepository.update(player.id, { game });
  }

  async getAnswers(game: GameEntity): Promise<AnswerEntity[]> {
    const result = await this.repo
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.answers', 'answer')
      .leftJoinAndSelect('answer.player', 'player')
      .leftJoinAndSelect('answer.choices', 'choices')
      .where({ id: game.id })
      .getOneOrFail();

    return result.answers!;
  }

  async addAnswer(game: GameEntity, answer: AnswerEntity): Promise<void> {
    await this.answerRepository.update(answer.id, { game });
  }
}
