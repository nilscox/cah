import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import { EntityRepository, Repository } from 'typeorm';

import { Question } from '../../../domain/entities/Question';
import { QuestionRepository } from '../../../domain/interfaces/QuestionRepository';
import { GameEntity } from '../entities/GameEntity';
import { QuestionEntity } from '../entities/QuestionEntity';
import { TurnEntity } from '../entities/TurnEntity';

import { randomize } from './SQLChoiceRepository';

@EntityRepository(QuestionEntity)
export class SQLQuestionRepository extends Repository<QuestionEntity> implements QuestionRepository {
  async createQuestions(game: GameEntity, questions: Question[]): Promise<void> {
    const entities = questions.map((question) =>
      this.create({ text: question.text, blanks: question.blanks, game: { id: game.id } }),
    );

    await this.insert(entities);
  }

  async pickRandomQuestions(count: number): Promise<Question[]> {
    const data = await promisify(fs.readFile)(path.join(process.env.DATA_DIR!, 'fr', 'questions.json'));
    const questions = JSON.parse(String(data));

    randomize(questions);

    return questions.slice(0, count).map((data: any) => Object.assign(new Question(), data));
  }

  async getNextAvailableQuestion(game: GameEntity): Promise<QuestionEntity | undefined> {
    const qb = this.createQueryBuilder('question').where('question.gameId = :id', { id: game.id });

    if (game.question) {
      qb.andWhere('question.id <> :questionId', { questionId: game.question?.id });
    }

    qb.andWhere(
      (qb) =>
        'question.id NOT IN ' +
        qb
          .subQuery()
          .select('turn.questionId')
          .from(TurnEntity, 'turn')
          .where('turn.gameId = :gameId', { gameId: game.id })
          .getQuery(),
    );

    return qb.getOne();
  }
}
