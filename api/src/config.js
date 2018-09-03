const getEnv = (key, defaultValue) => {
  const value = process.env[key];

  if (value !== undefined)
    return value;

  if (defaultValue !== undefined)
    return defaultValue;

  /* eslint-disable no-console */
  try { throw new Error('missing env: ' + key); }
  catch (e) { console.error('FATAL', e); }
  finally { process.exit(1); }
  /* eslint-enable no-console */
};

const config = {
  env: getEnv('NODE_ENV'),
  database: {
    username: getEnv('CAH_DB_USER'),
    password: getEnv('CAH_DB_PASSWORD'),
    database: getEnv('CAH_DB_NAME'),
    host: getEnv('CAH_DB_HOST',' localhost'),
    port: parseInt(getEnv('CAH_DB_PORT', '5432')),
  },
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
