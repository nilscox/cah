const getEnv = require('./getEnv');

module.exports = {
  username: getEnv('CAH_DB_USER'),
  password: getEnv('CAH_DB_PASSWORD'),
  database: getEnv('CAH_DB_NAME'),
  host: getEnv('CAH_DB_HOST',' localhost'),
  port: parseInt(getEnv('CAH_DB_PORT', '5432')),
  dialect: 'postgres',
};
