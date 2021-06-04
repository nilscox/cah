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

  pickRandomQuestions(_count: number): Promise<Question[]> {
    throw new Error('Method not implemented.');
  }

  async getNextAvailableQuestion(game: GameEntity): Promise<QuestionEntity | undefined> {
    return this.createQueryBuilder('question')
      .where('gameId = :id', { id: game.id })
      .andWhere('question.id IS NOT :questionId', { questionId: game.question?.id })
      .andWhere(
        (qb) =>
          'question.id NOT IN ' +
          qb
            .subQuery()
            .select('turn.questionId')
            .from(TurnEntity, 'turn')
            .where('turn.gameId = :gameId', { gameId: game.id })
            .getQuery(),
      )
      .getOne();
  }
}
