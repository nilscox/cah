import { EntityRepository, Repository } from 'typeorm';

import { Answer } from '../../../domain/entities/Answer';
import { AnswerRepository } from '../../../domain/interfaces/AnswerRepository';
import { AnswerEntity } from '../entities/AnswerEntity';
import { ChoiceEntity } from '../entities/ChoiceEntity';
import { PlayerEntity } from '../entities/PlayerEntity';

@EntityRepository(AnswerEntity)
export class SQLAnswerRepository extends Repository<AnswerEntity> implements AnswerRepository {
  async saveAll(answer: Answer[]): Promise<void> {
    await this.save(answer);
  }

  async createAnswer(player: PlayerEntity, choices: ChoiceEntity[]): Promise<AnswerEntity> {
    const answer = new AnswerEntity();

    answer.player = player;
    answer.choices = choices;

    await this.save(answer);

    return answer;
  }
}
