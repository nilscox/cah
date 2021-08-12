/* eslint-env node, commonjs */
/* eslint-disable @typescript-eslint/no-var-requires */

const dotenv = require('dotenv');
const { SnakeNamingStrategy } = require('typeorm-naming-strategies');

dotenv.config();

const database = process.env.DB_FILE ?? ':memory:';
const code = process.env.NODE_ENV === 'production' ? 'dist' : 'src';
const entitiesDir = `${code}/infrastructure/database/entities`;
const migrationsDir = `${code}/infrastructure/database/migrations`;

module.exports = {
  type: 'sqlite',
  database,
  namingStrategy: new SnakeNamingStrategy(),
  entities: [`${entitiesDir}/*`],
  migrations: [`${migrationsDir}/*`],
  cli: {
    migrationsDir,
  },
};
