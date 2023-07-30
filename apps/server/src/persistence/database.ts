import path from 'node:path';
import url from 'node:url';

import { injectableClass } from 'ditox';
import { sql } from 'drizzle-orm';
import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

import { ConfigPort } from 'src/adapters';
import { TOKENS } from 'src/tokens';

import * as schema from './drizzle-schema';

type DrizzleDb = PostgresJsDatabase<typeof schema>;

export class Database {
  static inject = injectableClass(this, TOKENS.config);

  private client: postgres.Sql;
  private db: DrizzleDb;

  constructor(config: ConfigPort) {
    const { url, debug } = config.database;

    this.client = postgres(url, { debug });
    this.db = drizzle(this.client, { schema });

    this.query = this.db.query;
    this.execute = this.db.execute.bind(this.db);

    this.select = this.db.select.bind(this.db);
    this.insert = this.db.insert.bind(this.db);
    this.update = this.db.update.bind(this.db);
    this.delete = this.db.delete.bind(this.db);
  }

  query: DrizzleDb['query'];
  execute: DrizzleDb['execute'];

  select: DrizzleDb['select'];
  insert: DrizzleDb['insert'];
  update: DrizzleDb['update'];
  delete: DrizzleDb['delete'];

  async clear(schema = 'cah') {
    const result = await this.execute(
      sql`select tablename from pg_catalog.pg_tables where schemaname=${schema}`,
    );

    if (result.length === 0) {
      return;
    }

    const tables = result.map(({ tablename }) => `${schema}.${tablename as string}`);
    await this.execute(sql.raw(`truncate table ${tables.join(', ')} cascade`));
  }

  async migrate(schema = 'cah') {
    const result = await this.execute(
      sql`SELECT schema_name FROM information_schema.schemata where schema_name = ${schema}`,
    );

    if (result.length === 1) {
      return;
    }

    const dirname = url.fileURLToPath(new URL('.', import.meta.url));

    await migrate(this.db, { migrationsFolder: path.join(dirname, 'migrations') });
  }

  async closeConnection() {
    await this.client.end({ timeout: 5000 });
  }
}
