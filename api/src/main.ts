import { createConnection } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import knexFactory from 'knex';
import connectSessionKnex from 'connect-session-knex';
import expressSession from 'express-session';

import { bootstrapServer } from './infrastructure';
import { entities } from './infrastructure/database/entities';

const { PORT = '4242', HOST = '0.0.0.0', DATA_DIR = './data' } = process.env;

const hostname = HOST;
const port = Number.parseInt(PORT);
const dataDir = DATA_DIR;

export const main = async () => {
  const connection = await createConnection({
    type: 'sqlite',
    database: './db.sqlite',
    entities,
    synchronize: true,
    namingStrategy: new SnakeNamingStrategy(),
  });

  const knex = knexFactory({
    useNullAsDefault: true,
    client: 'sqlite3',
    connection: {
      filename: 'db.sqlite',
    },
  });

  const KnexSessionStore = connectSessionKnex(expressSession);

  const knexSessionStore = new KnexSessionStore({
    tablename: 'sessions',
    createtable: true,
    knex: knex as any,
  });

  const server = await bootstrapServer({
    connection,
    sessionStore: knexSessionStore,
    dataDir,
  });

  if (isNaN(port) || port <= 0) {
    throw new Error(`process.env.PORT = "${PORT}" is not a positive integer`);
  }

  await new Promise<void>((resolve) => server.listen(port, hostname, resolve));
  console.info(`server started on port ${port}`);

  const close = server.close;

  server.close = (cb) => {
    knex.destroy();
    return close.call(server, cb);
  };
};
