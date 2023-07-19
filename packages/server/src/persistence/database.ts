import { injectableClass } from 'ditox';
import { sql } from 'drizzle-orm';
import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { ConfigPort } from 'src/adapters';
import { TOKENS } from 'src/tokens';

import { games, players } from './drizzle-schema';

type DrizzleDb = PostgresJsDatabase<typeof Database.schema>;

export class Database {
  static inject = injectableClass(this, TOKENS.config);

  static schema = {
    games,
    players,
  };

  private client: postgres.Sql;
  private db: DrizzleDb;

  constructor(config: ConfigPort) {
    this.client = postgres(config.database.url);
    this.db = drizzle(this.client, {
      schema: Database.schema,
    });

    this.execute = this.db.execute.bind(this.db);
    this.select = this.db.select.bind(this.db);
    this.insert = this.db.insert.bind(this.db);
    this.update = this.db.update.bind(this.db);
    this.delete = this.db.delete.bind(this.db);
  }

  execute: DrizzleDb['execute'];
  select: DrizzleDb['select'];
  insert: DrizzleDb['insert'];
  update: DrizzleDb['update'];
  delete: DrizzleDb['delete'];

  async clear(schema = 'public') {
    const result = await this.execute(
      sql`select tablename from pg_catalog.pg_tables where schemaname=${schema}`
    );

    if (result.length === 0) {
      return;
    }

    const tables = result.map(({ tablename }) => `${schema}.${tablename as string}`);
    await this.execute(sql.raw(`truncate table ${tables.join(', ')} cascade`));
  }
}
