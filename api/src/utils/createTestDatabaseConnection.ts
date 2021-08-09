import dotenv from 'dotenv';
import { Connection, createConnection } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { entities } from '../infrastructure/database/entities';

dotenv.config();

const database = process.env.DB_NAME ?? ':memory:';
const logging = process.env.DB_LOGS === 'true';

export const createTestDatabaseConnection = () => {
  let connection: Connection;

  before(async () => {
    connection = await createConnection({
      type: 'sqlite',
      database,
      entities,
      synchronize: true,
      logging,
      namingStrategy: new SnakeNamingStrategy(),
    });
  });

  after(async () => {
    await connection?.close();
  });

  beforeEach(async () => {
    await connection.synchronize(true);
  });

  return () => connection;
};
