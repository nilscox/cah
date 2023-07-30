import { and, eq, isNull } from 'drizzle-orm';

import { Answer } from 'src/entities';

import { Database } from '../../database';
import { SqlAnswer, answers } from '../../drizzle-schema';
import { EntityNotFoundError } from '../../entity-not-found-error';

import { AnswerRepository } from './answer.repository';

export class SqlAnswerRepository implements AnswerRepository {
  private table = answers;

  constructor(private readonly db: Database) {}

  private toAnswer = (model: SqlAnswer): Answer => ({
    id: model.id,
    gameId: model.gameId,
    playerId: model.playerId,
    questionId: model.questionId,
    place: model.place ?? undefined,
  });

  private toSql = (answer: Answer): SqlAnswer => ({
    id: answer.id,
    gameId: answer.gameId,
    playerId: answer.playerId,
    questionId: answer.questionId,
    turnId: answer.turnId ?? null,
    place: answer.place ?? null,
  });

  async findById(answerId: string): Promise<Answer> {
    const result = await this.db.query.answers.findFirst({
      where: eq(answers.id, answerId),
      with: { choices: true },
    });

    if (!result) {
      throw new EntityNotFoundError('Answer', { id: answerId });
    }

    return this.toAnswer(result);
  }

  async findForCurrentTurn(gameId: string): Promise<Answer[]> {
    const models = await this.db.query.answers.findMany({
      where: and(eq(answers.gameId, gameId), isNull(answers.turnId)),
      with: { choices: true },
    });

    return models.map(this.toAnswer);
  }

  async insert(answer: Answer): Promise<void> {
    await this.db.insert(this.table).values(this.toSql(answer));
  }

  async updateMany(answers: Answer[]): Promise<void> {
    for (const answer of answers) {
      await this.db.update(this.table).set(this.toSql(answer)).where(eq(this.table.id, answer.id));
    }
  }
}
