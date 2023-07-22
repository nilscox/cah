import * as shared from '@cah/shared';
import { eq, sql } from 'drizzle-orm';

import { Turn } from 'src/entities';

import { Database } from '../../database';
import { turns } from '../../drizzle-schema';
import { EntityNotFoundError } from '../../entity-not-found-error';

import { TurnRepository } from './turn.repository';

export class SqlTurnRepository implements TurnRepository {
  constructor(private readonly db: Database) {}

  async query(turnId: string): Promise<shared.Turn> {
    const result = await this.db.query.turns.findFirst({
      where: eq(turns.id, turnId),
    });

    if (!result) {
      throw new EntityNotFoundError('Turn', { id: turnId });
    }

    return {
      id: result.id,
    };
  }

  async insert(turn: Turn): Promise<void> {
    await this.db.insert(turns).values({
      id: turn.id,
      gameId: turn.gameId,
      questionMasterId: turn.questionMasterId,
      questionId: turn.questionId,
      selectedAnswerId: turn.selectedAnswerId,
      place: sql`(select count(*) + 1 from ${turns})`,
    });
  }
}
