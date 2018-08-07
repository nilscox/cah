const sql = require('sql-formatter');

const getEnv = key => {
  const value = process.env[key];

  if (!key) {
    console.log('missing env: ' + key);
    process.exit(1);
  }

  return value;
};

const cfg = {
  username: getEnv('CAH_DB_USER'),
  password: getEnv('CAH_DB_PASSWORD'),
  database: getEnv('CAH_DB_NAME'),
  host: getEnv('CAH_DB_HOST'),
  port: getEnv('CAH_DB_PORT'),
  dialect: 'postgres',
  operatorsAliases: false,
};

if (getEnv('NODE_ENV') === 'test') {
  cfg.rootUsername = getEnv('CAH_DB_ROOT_USER');
  cfg.rootPassword = getEnv('CAH_DB_ROOT_PASSWORD');
  cfg.logging = () => {};
}

module.exports = cfg;
