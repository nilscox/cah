import { and, eq, isNull } from 'drizzle-orm';

import { type Question } from 'src/entities';

import { Database } from '../../database.ts';
import { type SqlQuestion, questions, turns } from '../../drizzle-schema.ts';
import { EntityNotFoundError } from '../../entity-not-found-error.ts';

import { type QuestionRepository } from './question.repository.ts';

export class SqlQuestionRepository implements QuestionRepository {
  constructor(private readonly db: Database) {}

  private toQuestion = (model: SqlQuestion): Question => ({
    id: model.id,
    gameId: model.gameId,
    text: model.text,
    blanks: model.blanks.length === 0 ? undefined : model.blanks,
  });

  private toSql = (question: Question): SqlQuestion => ({
    id: question.id,
    gameId: question.gameId,
    blanks: question.blanks ?? [],
    text: question.text,
  });

  async findById(id: string): Promise<Question> {
    const [result] = await this.db.select().from(questions).where(eq(questions.id, id));

    if (!result) {
      throw new EntityNotFoundError('Question', { id });
    }
    return this.toQuestion(result);
  }

  async findNextAvailableQuestion(gameId: string): Promise<Question | undefined> {
    const [result] = await this.db
      .select()
      .from(questions)
      .leftJoin(turns, eq(questions.id, turns.questionId))
      .where(and(eq(questions.gameId, gameId), isNull(turns.id)))
      .limit(1);

    if (!result) {
      return undefined;
    }

    return this.toSql(result?.questions);
  }

  async insertMany(values: Question[]): Promise<void> {
    await this.db.insert(questions).values(values.map(this.toSql));
  }
}
