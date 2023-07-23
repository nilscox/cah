import { GameState } from '@cah/shared';
import { InferModel } from 'drizzle-orm';
import { AnyPgTable, PgInsertValue } from 'drizzle-orm/pg-core';

import { StubConfigAdapter } from 'src/adapters';
import { createId } from 'src/utils/create-id';
import { AsyncFactory, Factory, factory } from 'src/utils/factory';

import { Database } from './database';
import {
  answers,
  choices,
  games,
  players,
  questions,
  SqlAnswer,
  SqlChoice,
  SqlGame,
  SqlPlayer,
  SqlQuestion,
  SqlTurn,
  turns,
} from './drizzle-schema';

export class TestRepository {
  config = new StubConfigAdapter({
    database: {
      url: process.env.DATABASE_URL ?? 'postgres://postgres@localhost:5432/cah',
      debug: true,
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
    await this.db.migrate();
    await this.db.clear();
  }

  getRepository<T>(Repository: { new (database: Database): T }) {
    return new Repository(this.db);
  }
}

class EntitiesCreator {
  constructor(private readonly database: Database) {}

  private defaultGame = factory<SqlGame>(() => ({
    id: createId(),
    code: '',
    state: GameState.idle,
    questionMasterId: null,
    questionId: null,
    selectedAnswerId: null,
  }));

  game = this.createInsert(games, this.defaultGame);

  private defaultPlayer = factory<SqlPlayer>(() => ({
    id: createId(),
    gameId: null,
    nick: '',
  }));

  player = this.createInsert(players, this.defaultPlayer);

  private defaultChoice = factory<SqlChoice>(() => ({
    id: createId(),
    gameId: '',
    playerId: null,
    answerId: null,
    text: '',
    caseSensitive: false,
    place: null,
  }));

  choice = this.createInsert(choices, this.defaultChoice);

  private defaultQuestion = factory<SqlQuestion>(() => ({
    id: createId(),
    gameId: '',
    text: '',
    blanks: [],
  }));

  question = this.createInsert(questions, this.defaultQuestion);

  private defaultAnswer = factory<SqlAnswer>(() => ({
    id: createId(),
    gameId: '',
    playerId: '',
    questionId: '',
    turnId: null,
    place: 0,
  }));

  answer = this.createInsert(answers, this.defaultAnswer);

  private defaultTurn = factory<SqlTurn>(() => ({
    id: createId(),
    gameId: '',
    questionMasterId: '',
    questionId: '',
    selectedAnswerId: '',
    place: 0,
  }));

  turn = this.createInsert(turns, this.defaultTurn);

  private createInsert<Table extends AnyPgTable>(
    table: Table,
    factory: Factory<InferModel<Table>>,
  ): AsyncFactory<InferModel<Table>> {
    return async (values) => {
      const model: InferModel<Table> = factory(values);

      await this.database
        .insert(table)
        .values(model as PgInsertValue<Table>)
        .returning();

      return model;
    };
  }
}
