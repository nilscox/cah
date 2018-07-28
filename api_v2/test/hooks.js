const Promise = require('bluebird');

const path = require('path');
const { Client } = require('pg');
const Sequelize = require('sequelize');
const Umzug = require('umzug');

const config = require('../config');

const API_URL = process.env.REACT_APP_CAH_API_URL;
const API_TOKEN = process.env.CAH_API_ADMIN_TOKEN;
const DB_TEMPLATE_NAME = 'cah_test';

const pgClient = () => {
  const pg = new Client({
    host: config.host,
    port: config.port,
    user: config.rootUsername,
    password: config.rootPassword,
    database: 'postgres',
  });

  return Promise.resolve(pg)
    .tap(pg => pg.connect());
}

const setup = () => {
  return pgClient()
    .tap(pg => pg.query(`CREATE DATABASE ${DB_TEMPLATE_NAME}`))
    .tap(pg => pg.query(`GRANT ALL ON DATABASE ${DB_TEMPLATE_NAME} TO ${config.username}`))
    .tap(() => {
      const sequelize = new Sequelize(DB_TEMPLATE_NAME, config.username, config.password, config);

      return new Umzug({
        storage: 'sequelize',

        storageOptions: {
          sequelize: sequelize
        },

        migrations: {
          params: [
            sequelize.getQueryInterface(),
            Sequelize,
          ],
          path: path.resolve(__dirname, '..', 'migrations'),
        },
      })
        .up()
        .then(() => sequelize.close());
    })
    .tap(pg => pg.end());
};

const cleanup = () => {
  return pgClient()
    .tap(pg => pg.query(`DROP DATABASE ${DB_TEMPLATE_NAME}`))
    .tap(pg => pg.end());
}

const setupTest = dbName => {
  return pgClient()
    .tap(pg => pg.query(`CREATE DATABASE ${dbName} WITH TEMPLATE ${DB_TEMPLATE_NAME}`))
    .tap(pg => pg.query(`GRANT ALL ON DATABASE ${dbName} TO ${config.username}`))
    .tap(pg => pg.end());
};

const cleanupTest = dbName => {
  return pgClient()
    .tap(pg => pg.query(`
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = '${dbName}' AND pid <> pg_backend_pid();
    `))
    .tap(pg => pg.query(`DROP DATABASE ${dbName}`))
    .tap(pg => pg.end());
};

before(setup);
after(cleanup);

beforeEach(function() {
  this.dbName = 'cah_test__' + Math.random().toString(16).slice(7);

  process.env.CAH_DB_NAME = this.dbName;

  Object.keys(require.cache).forEach(k => {
    if (!/node_modules/.exec(k))
      delete require.cache[k];
  });

  this.app = require('../app');
  this.models = require('../models');

  return setupTest(this.dbName);
});

afterEach(function() {
  return cleanupTest(this.dbName);
});
