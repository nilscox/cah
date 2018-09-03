const { getEnv } = require('./utils');
const { database } = require('./log');

const cfg = {
  username: getEnv('CAH_DB_USER'),
  password: getEnv('CAH_DB_PASSWORD'),
  database: getEnv('CAH_DB_NAME'),
  host: getEnv('CAH_DB_HOST'),
  port: getEnv('CAH_DB_PORT'),
  dialect: 'postgres',
  operatorsAliases: false,
  logging: sql => database.info(sql),
};

if (getEnv('NODE_ENV') === 'test') {
  cfg.rootUsername = getEnv('CAH_DB_ROOT_USER');
  cfg.rootPassword = getEnv('CAH_DB_ROOT_PASSWORD');
}

module.exports = cfg;
