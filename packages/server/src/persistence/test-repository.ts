import { GameState } from '@cah/shared';
import { InferModel } from 'drizzle-orm';
import { AnyPgTable, PgInsertValue } from 'drizzle-orm/pg-core';

import { StubConfigAdapter } from 'src/adapters';
import { createId } from 'src/utils/create-id';
import { AsyncFactory } from 'src/utils/factory';

import { Database } from './database';
import {
  choices,
  games,
  players,
  questions,
  SqlChoice,
  SqlGame,
  SqlPlayer,
  SqlQuestion,
} from './drizzle-schema';

export class TestRepository {
  config = new StubConfigAdapter({
    database: {
      url: 'postgres://postgres@localhost:5432/cah',
    },
  });

  db = new Database(this.config);
  create = new EntitiesCreator(this.db);

  static async create() {
    const test = new TestRepository();

    await test.setup();

    return test;
  }

  async setup() {
    await this.db.clear('cah');
  }

  getRepository<T>(Repository: { new (database: Database): T }) {
    return new Repository(this.db);
  }
}

class EntitiesCreator {
  constructor(private readonly database: Database) {}

  private defaultGame: SqlGame = {
    id: createId(),
    code: '',
    state: GameState.idle,
    questionMasterId: null,
    questionId: null,
  };

  game = this.createInsert(games, this.defaultGame);

  private defaultPlayer: SqlPlayer = {
    id: createId(),
    gameId: null,
    nick: '',
  };

  player = this.createInsert(players, this.defaultPlayer);

  private defaultChoice: SqlChoice = {
    id: createId(),
    gameId: '',
    playerId: null,
    answerId: null,
    text: '',
    caseSensitive: false,
    place: null,
  };

  choice = this.createInsert(choices, this.defaultChoice);

  private defaultQuestion: SqlQuestion = {
    id: createId(),
    gameId: '',
    text: '',
    blanks: [],
  };

  question = this.createInsert(questions, this.defaultQuestion);

  private createInsert<Table extends AnyPgTable>(
    table: Table,
    defaultValues: InferModel<Table>
  ): AsyncFactory<InferModel<Table>> {
    return async (values) => {
      const model: InferModel<Table> = { ...defaultValues, ...values };

      await this.database
        .insert(table)
        .values(model as PgInsertValue<Table>)
        .returning();

      return model;
    };
  }
}
