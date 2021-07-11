import { EntityRepository, Repository } from 'typeorm';

import { Question } from '../../../domain/entities/Question';
import { QuestionRepository } from '../../../domain/interfaces/QuestionRepository';
import { GameEntity } from '../entities/GameEntity';
import { QuestionEntity } from '../entities/QuestionEntity';
import { TurnEntity } from '../entities/TurnEntity';

@EntityRepository(QuestionEntity)
export class SQLQuestionRepository extends Repository<QuestionEntity> implements QuestionRepository {
  async createQuestions(game: GameEntity, questions: Question[]): Promise<void> {
    const entities = questions.map((question) =>
      this.create({ text: question.text, blanks: question.blanks, game: { id: game.id } }),
    );

    await this.insert(entities);
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
