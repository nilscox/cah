import { eq } from 'drizzle-orm';

import { Game, GameState, StartedGame, isStarted } from 'src/entities';
import { toEnum } from 'src/utils/to-enum';

import { Database } from '../../database';
import { SqlGame, games } from '../../drizzle-schema';
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
  });

  private toSql = (game: Game | StartedGame): SqlGame => {
    const model: SqlGame = {
      id: game.id,
      code: game.code,
      state: game.state,
      questionMasterId: null,
      questionId: null,
    };

    if (isStarted(game)) {
      model.questionMasterId = game.questionMasterId;
      model.questionId = game.questionId;
    }

    return model;
  };

  async findById(id: string): Promise<Game> {
    const [result] = await this.db.select().from(games).where(eq(games.id, id));

    if (!result) {
      throw new EntityNotFoundError('Game', { id });
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
