
const env = process.env.NODE_ENV || 'test';

const path = require('path');
const { Client } = require('pg');
const Sequelize = require('sequelize');
const Umzug = require('umzug');

const config = require('../config/config')[env];

const API_URL = process.env.REACT_APP_CAH_API_URL;
const API_TOKEN = process.env.CAH_API_ADMIN_TOKEN;
const DB_TEMPLATE_NAME = 'cah_test';

const pgClient = async () => {
  const pg = new Client({
    host: config.host,
    port: config.port,
    user: config.username,
    password: config.password,
    database: 'postgres',
  });

  await pg.connect();

  return pg;
}

const setupDB = async () => {
  const pg = await pgClient();

  const res = await pg.query(`SELECT COUNT(*) FROM pg_database where datname = '${DB_TEMPLATE_NAME}'`);

  if (res.rows[0].count > 0)
    await pg.query(`DROP DATABASE ${DB_TEMPLATE_NAME}`);

  await pg.query(`CREATE DATABASE ${DB_TEMPLATE_NAME}`);

  const sequelize = new Sequelize(DB_TEMPLATE_NAME, config.username, config.password, config);
  const umzug = new Umzug({
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
  });

  await umzug.up();
  await pg.end();
};

const cleanupDB = async () => {
  const pg = await pgClient();

  await pg.query(`
    SELECT pg_terminate_backend(pg_stat_activity.pid)
    FROM pg_stat_activity
    WHERE pg_stat_activity.datname = '${DB_TEMPLATE_NAME}' AND pid <> pg_backend_pid()
  `);
  await pg.query(`DROP DATABASE ${DB_TEMPLATE_NAME}`);
  await pg.end();
}

const createTestDB = dbName => async () => {
  const pg = await pgClient();

  await pg.query(`CREATE DATABASE ${dbName} WITH TEMPLATE ${DB_TEMPLATE_NAME}`);
  await pg.query(`GRANT ALL ON DATABASE ${dbName} TO ${DB_USER}`);
  await pg.end();
};

const dropTestDB = dbName => async () => {
  const pg = await pgClient();

  await pg.query(`DROP DATABASE ${dbName}`);
  await pg.end();
};

const trycatch = f => (...args) => {
  try {
    return f(...args);
  } catch (e) {
    console.error(e);
  }
}

before(trycatch(setupDB));
after(trycatch(cleanupDB));

beforeEach(trycatch(function() {
  this.dbName = 'cah_test_player__' + Math.random().toString(16).slice(7);
  createTestDB(this.dbName);
}));

afterEach(trycatch(function() {
  dropTestDB(this.dbName);
}));
