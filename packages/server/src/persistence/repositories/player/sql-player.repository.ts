import * as shared from '@cah/shared';
import { InferModel, eq } from 'drizzle-orm';

import { Player } from 'src/entities';

import { Database } from '../../database';
import { players } from '../../drizzle-schema';
import { EntityNotFoundError } from '../../entity-not-found-error';

import { PlayerRepository } from './player.repository';

export class SqlPlayerRepository implements PlayerRepository {
  constructor(private readonly db: Database) {}

  private toPlayer = (model: InferModel<typeof players>): Player => ({
    id: model.id,
    nick: model.nick,
    gameId: model.gameId ?? undefined,
  });

  async query(playerId: string): Promise<shared.Player> {
    const result = await this.db.query.players.findFirst({
      where: eq(players.id, playerId),
      with: {
        cards: true,
      },
    });

    if (!result) {
      throw new EntityNotFoundError('Player', { id: playerId });
    }

    const player: shared.Player = {
      id: result.id,
      nick: result.nick,
      gameId: result.gameId ?? undefined,
    };

    console.log(result.cards.length);
    if (result.cards.length > 0) {
      player.cards = result.cards?.map((choice) => ({
        id: choice.id,
        text: choice.text,
        caseSensitive: choice.caseSensitive,
      }));
    }

    return player;
  }

  async findById(playerId: string): Promise<Player> {
    const [result] = await this.db.select().from(players).where(eq(players.id, playerId));

    if (!result) {
      throw new EntityNotFoundError('Player', { id: playerId });
    }

    return this.toPlayer(result);
  }

  async findByNick(nick: string): Promise<Player | undefined> {
    const [result] = await this.db.select().from(players).where(eq(players.nick, nick));

    if (!result) {
      return undefined;
    }

    return this.toPlayer(result);
  }

  async findAllByGameId(gameId: string): Promise<Player[]> {
    const results = await this.db.select().from(players).where(eq(players.gameId, gameId));

    return results.map((result) => this.toPlayer(result));
  }

  async insert(player: Player): Promise<void> {
    await this.db.insert(players).values({
      id: player.id,
      nick: player.nick,
      gameId: player.gameId ?? null,
    });
  }

  async update(player: Player): Promise<void> {
    await this.db
      .update(players)
      .set({
        nick: player.nick,
        gameId: player.gameId ?? null,
      })
      .where(eq(players.id, player.id));
  }
}
