import { EntityRepository, Repository } from 'typeorm';

import { Choice } from '../../../domain/entities/Choice';
import { ChoiceRepository } from '../../../domain/interfaces/ChoiceRepository';
import { AnswerEntity } from '../entities/AnswerEntity';
import { ChoiceEntity } from '../entities/ChoiceEntity';
import { GameEntity } from '../entities/GameEntity';
import { PlayerEntity } from '../entities/PlayerEntity';
import { TurnEntity } from '../entities/TurnEntity';

@EntityRepository(ChoiceEntity)
export class SQLChoiceRepository extends Repository<ChoiceEntity> implements ChoiceRepository {
  async createChoices(game: GameEntity, choices: ChoiceEntity[]): Promise<void> {
    await this.insert(choices.map((choice) => ({ ...choice, game })));
  }

  pickRandomChoices(_count: number): Promise<Choice[]> {
    throw new Error('Method not implemented.');
  }

  async getAvailableChoices(game: GameEntity): Promise<ChoiceEntity[]> {
    return this.createQueryBuilder('choice')
      .where('choice.gameId = :gameId', { gameId: game.id })
      .andWhere(
        (qb) =>
          'choice.id NOT IN ' +
          qb
            .subQuery()
            .select('card.id')
            .from(PlayerEntity, 'player')
            .innerJoin('player.cards', 'card')
            .where('player.gameId = :gameId', { gameId: game.id })
            .getQuery(),
      )
      .andWhere(
        (qb) =>
          'choice.id NOT IN ' +
          qb
            .subQuery()
            .select('choice.id')
            .from(AnswerEntity, 'answer')
            .innerJoin('answer.choices', 'choice')
            .where('answer.gameId = :gameId', { gameId: game.id })
            .getQuery(),
      )
      .andWhere(
        (qb) =>
          'choice.id NOT IN ' +
          qb
            .subQuery()
            .select('choice.id')
            .from(TurnEntity, 'turn')
            .innerJoin('turn.answers', 'answer')
            .innerJoin('answer.choices', 'choice')
            .where('turn.gameId = :gameId', { gameId: game.id })
            .getQuery(),
      )
      .getMany();
  }
}
