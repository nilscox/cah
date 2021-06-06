import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import { EntityRepository, Repository } from 'typeorm';

import { Choice } from '../../../domain/entities/Choice';
import { ChoiceRepository } from '../../../domain/interfaces/ChoiceRepository';
import { AnswerEntity } from '../entities/AnswerEntity';
import { ChoiceEntity } from '../entities/ChoiceEntity';
import { GameEntity } from '../entities/GameEntity';
import { PlayerEntity } from '../entities/PlayerEntity';
import { TurnEntity } from '../entities/TurnEntity';

export const randomize = <T>(array: T[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};

@EntityRepository(ChoiceEntity)
export class SQLChoiceRepository extends Repository<ChoiceEntity> implements ChoiceRepository {
  async createChoices(game: GameEntity, choices: Choice[]): Promise<void> {
    await this.insert(choices.map((choice) => ({ ...choice, game })));
  }

  async pickRandomChoices(count: number): Promise<Choice[]> {
    const data = await promisify(fs.readFile)(path.join(process.env.DATA_DIR!, 'fr', 'choices.json'));
    const choices = JSON.parse(String(data));

    randomize(choices);

    return choices.slice(0, count).map((data: any) => Object.assign(new Choice(), data));
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
