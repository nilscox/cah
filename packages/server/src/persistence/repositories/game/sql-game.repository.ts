import * as shared from '@cah/shared';
import { asc, eq, isNull } from 'drizzle-orm';

import { Game, GameState, StartedGame, isStarted } from 'src/entities';
import { toEnum } from 'src/utils/to-enum';

import { Database } from '../../database';
import { SqlGame, answers, choices, games } from '../../drizzle-schema';
import { EntityNotFoundError } from '../../entity-not-found-error';

import { GameRepository } from './game.repository';

export class SqlGameRepository implements GameRepository {
  constructor(private readonly db: Database) {}

  private toGame = (model: SqlGame): Game | StartedGame => ({
    id: model.id,
    code: model.code,
    state: toEnum(GameState, model.state),
    questionMasterId: model.questionMasterId ?? undefined,
    questionId: model.questionId ?? undefined,
    selectedAnswerId: model.selectedAnswerId ?? undefined,
  });

  private toSql = (game: Game | StartedGame): SqlGame => {
    const model: SqlGame = {
      id: game.id,
      code: game.code,
      state: game.state,
      questionMasterId: null,
      questionId: null,
      selectedAnswerId: null,
    };

    if (isStarted(game)) {
      model.questionMasterId = game.questionMasterId;
      model.questionId = game.questionId;

      if (game.selectedAnswerId) {
        model.selectedAnswerId = game.selectedAnswerId;
      }
    }

    return model;
  };

  async query(gameId: string): Promise<shared.Game> {
    const model = await this.db.query.games.findFirst({
      where: eq(games.id, gameId),
      with: {
        players: true,
        answers: {
          orderBy: [asc(answers.place)],
          where: isNull(answers.turnId),
          with: {
            choices: {
              orderBy: [asc(choices.place)],
            },
          },
        },
      },
    });

    if (!model) {
      throw new EntityNotFoundError('Game', { gameId });
    }

    const game: shared.Game = {
      id: model.id,
      code: model.code,
      state: toEnum(GameState, model.state),
      players: model.players.map((player) => ({
        id: player.id,
        nick: player.nick,
      })),
    };

    if (game.state === shared.GameState.started) {
      const allPlayersAnswered = model.answers.length === game.players.length - 1;

      game.selectedAnswerId = model.selectedAnswerId ?? undefined;

      game.answers = model.answers.map((model) => {
        const answer: shared.AnonymousAnswer = {
          id: model.id,
          choices: model.choices.map((choice) => ({
            id: choice.id,
            text: choice.text,
            caseSensitive: choice.caseSensitive,
          })),
        };

        if (allPlayersAnswered) {
          (answer as shared.Answer).playerId = model.playerId;
        }

        return answer;
      });
    }

    return game;
  }

  async findById(gameId: string): Promise<Game> {
    const [result] = await this.db.select().from(games).where(eq(games.id, gameId));

    if (!result) {
      throw new EntityNotFoundError('Game', { id: gameId });
    }

    return this.toGame(result);
  }

  async findByCode(code: string): Promise<Game> {
    const [result] = await this.db.select().from(games).where(eq(games.code, code));

    if (!result) {
      throw new EntityNotFoundError('Game', { code });
    }

    return this.toGame(result);
  }

  async insert(game: Game): Promise<void> {
    await this.db.insert(games).values(this.toSql(game));
  }

  async update(game: Game): Promise<void> {
    await this.db.update(games).set(this.toSql(game)).where(eq(games.id, game.id));
  }
}
