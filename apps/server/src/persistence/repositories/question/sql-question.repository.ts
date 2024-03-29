import { eq, isNull } from 'drizzle-orm';

import { Question } from 'src/entities';

import { Database } from '../../database';
import { SqlQuestion, questions, turns } from '../../drizzle-schema';
import { EntityNotFoundError } from '../../entity-not-found-error';

import { QuestionRepository } from './question.repository';

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
      .where(eq(questions.gameId, gameId))
      .where(isNull(turns.id))
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
