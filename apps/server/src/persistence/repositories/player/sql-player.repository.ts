import * as shared from '@cah/shared';
import { InferModel, and, eq, isNull } from 'drizzle-orm';

import { Player } from 'src/entities';

import { Database } from '../../database';
import { answers, players } from '../../drizzle-schema';
import { EntityNotFoundError } from '../../entity-not-found-error';

import { PlayerRepository } from './player.repository';

export class SqlPlayerRepository implements PlayerRepository {
  constructor(private readonly db: Database) {}

  private toPlayer = (model: InferModel<typeof players>): Player => ({
    id: model.id,
    nick: model.nick,
    gameId: model.gameId ?? undefined,
  });

  async query(playerId: string): Promise<shared.CurrentPlayer> {
    const result = await this.db.query.players.findFirst({
      where: eq(players.id, playerId),
      with: {
        cards: true,
      },
    });

    if (!result) {
      throw new EntityNotFoundError('Player', { id: playerId });
    }

    const player: shared.CurrentPlayer = {
      id: result.id,
      nick: result.nick,
      gameId: result.gameId ?? undefined,
    };

    if (result.cards.length > 0) {
      player.cards = result.cards?.map((choice) => ({
        id: choice.id,
        text: choice.text,
        caseSensitive: choice.caseSensitive,
      }));
    }

    if (player.gameId) {
      const answer = await this.db.query.answers.findFirst({
        where: and(
          eq(answers.gameId, player.gameId),
          eq(answers.playerId, player.id),
          isNull(answers.turnId),
        ),
        with: {
          choices: true,
        },
      });

      if (answer) {
        player.submittedAnswer = {
          id: answer.id,
          choices: answer.choices.map((choice) => ({
            id: choice.id,
            text: choice.text,
            caseSensitive: choice.caseSensitive,
          })),
          playerId: answer.playerId,
        };
      }
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
