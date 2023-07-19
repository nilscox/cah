import { and, eq, isNotNull, isNull } from 'drizzle-orm';

import { Choice } from 'src/entities';
import { hasProperty } from 'src/utils/has-property';
import { toObject } from 'src/utils/to-object';
import { unique } from 'src/utils/unique';

import { Database } from '../../database';
import { SqlChoice, choices } from '../../drizzle-schema';

import { ChoiceRepository } from './choice.repository';

export class SqlChoiceRepository implements ChoiceRepository {
  constructor(private readonly db: Database) {}

  private toChoice = (model: SqlChoice): Choice => ({
    id: model.id,
    gameId: model.gameId,
    playerId: model.playerId ?? undefined,
    text: model.text,
    caseSensitive: model.caseSensitive,
  });

  private toSql = (choice: Choice): SqlChoice => ({
    id: choice.id,
    gameId: choice.gameId,
    playerId: choice.playerId ?? null,
    text: choice.text,
    caseSensitive: choice.caseSensitive,
  });

  async findPlayersCards(gameId: string): Promise<Record<string, Choice[]>> {
    const results = await this.db
      .select()
      .from(choices)
      .where(and(eq(choices.gameId, gameId), isNotNull(choices.playerId)));

    const playersIds = unique(results.map((result) => result.playerId)).filter((value): value is string => {
      return value !== null;
    });

    return toObject(
      playersIds,
      (playerId) => playerId,
      (playerId) => results.filter(hasProperty('playerId', playerId)).map(this.toChoice)
    );
  }

  async findPlayerCards(playerId: string): Promise<Choice[]> {
    const results = await this.db.select().from(choices).where(eq(choices.playerId, playerId));

    return results.map(this.toChoice);
  }

  async findAvailable(gameId: string, limit: number): Promise<Choice[]> {
    const results = await this.db
      .select()
      .from(choices)
      .where(and(eq(choices.gameId, gameId), isNull(choices.playerId)))
      .limit(limit);

    return results.map(this.toChoice);
  }

  async insertMany(values: Choice[]): Promise<void> {
    await this.db.insert(choices).values(values.map(this.toSql));
  }

  async updateMany(values: Choice[]): Promise<void> {
    for (const value of values) {
      await this.db.update(choices).set(this.toSql(value)).where(eq(choices.id, value.id));
    }
  }
}
