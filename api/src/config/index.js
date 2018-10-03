const getEnv = require('./getEnv');
const database = require('./database');

const config = {
  env: getEnv('NODE_ENV'),
  database,
  dataPath: getEnv('CAH_DATA_PATH'),
  mediaPath: getEnv('CAH_MEDIA_PATH'),
  mediaRoot: getEnv('CAH_MEDIA_ROOT', '/media'),
  listenIP: getEnv('CAH_API_IP', '0.0.0.0'),
  listenPort: parseInt(getEnv('CAH_API_PORT', '4242')),
  adminToken: getEnv('CAH_API_ADMIN_TOKEN'),
  log: {
    request: getEnv('CAH_API_LOG_REQUEST', null),
    database: getEnv('CAH_API_LOG_DATABASE', null),
    server: getEnv('CAH_API_LOG_SERVER', null),
  },
};

if (config.env === 'test') {
  config.database.rootUsername = getEnv('CAH_DB_ROOT_USER');
  config.database.rootPassword = getEnv('CAH_DB_ROOT_PASSWORD');
}

module.exports = config;
