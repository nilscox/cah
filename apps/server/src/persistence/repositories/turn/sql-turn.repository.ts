import * as shared from '@cah/shared';
import { eq, sql } from 'drizzle-orm';

import { Turn } from 'src/entities';

import { Database } from '../../database';
import { SqlAnswer, SqlChoice, SqlQuestion, SqlTurn, turns } from '../../drizzle-schema';
import { EntityNotFoundError } from '../../entity-not-found-error';

import { TurnRepository } from './turn.repository';

type TurnQueryResult = SqlTurn & {
  question: SqlQuestion;
  answers: Array<
    SqlAnswer & {
      choices: Array<SqlChoice>;
    }
  >;
};

export class SqlTurnRepository implements TurnRepository {
  constructor(private readonly db: Database) {}

  private toTurnDto = (turn: TurnQueryResult): shared.Turn => ({
    id: turn.id,
    number: turn.number,
    question: {
      id: turn.question.id,
      text: turn.question.text,
      blanks: turn.question.blanks,
    },
    selectedAnswerId: turn.selectedAnswerId,
    answers: turn.answers.map((answer) => ({
      id: answer.id,
      playerId: answer.playerId,
      choices: answer.choices.map((choices) => ({
        id: choices.id,
        text: choices.text,
        caseSensitive: choices.caseSensitive,
      })),
    })),
  });

  async query(turnId: string): Promise<shared.Turn> {
    const result = await this.db.query.turns.findFirst({
      where: eq(turns.id, turnId),
      with: {
        question: true,
        answers: {
          with: {
            choices: true,
          },
        },
      },
    });

    if (!result) {
      throw new EntityNotFoundError('Turn', { id: turnId });
    }

    return this.toTurnDto(result);
  }

  async queryForGame(gameId: string): Promise<shared.Turn[]> {
    const results = await this.db.query.turns.findMany({
      where: eq(turns.gameId, gameId),
      with: {
        question: true,
        answers: {
          with: {
            choices: true,
          },
        },
      },
    });

    return results.map(this.toTurnDto);
  }

  async insert(turn: Turn): Promise<void> {
    await this.db.insert(turns).values({
      id: turn.id,
      number: sql`(select count(*) + 1 from ${turns})`,
      gameId: turn.gameId,
      questionMasterId: turn.questionMasterId,
      questionId: turn.questionId,
      selectedAnswerId: turn.selectedAnswerId,
    });
  }
}
