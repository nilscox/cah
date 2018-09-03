const app = require('./src/app');
const { getEnv, info } = require('./src/utils');

const IP = getEnv('CAH_API_IP', 'localhost');
const PORT = getEnv('CAH_API_PORT', 4242);

const config = {
  IP, PORT,
  DB_NAME: getEnv('CAH_DB_NAME'),
  DB_USER: getEnv('CAH_DB_USER'),
  DB_HOST: getEnv('CAH_DB_HOST'),
  DB_PORT: getEnv('CAH_DB_PORT'),
  DATA_PATH: getEnv('CAH_DATA_PATH'),
  MEDIA_PATH: getEnv('CAH_MEDIA_PATH'),
  MEDIA_ROOT: getEnv('CAH_MEDIA_ROOT'),
};

info('SERVER', 'config', '\n' + Object.keys(config).map(k => k.padEnd(12, ' ') + ': ' + config[k]).join('\n'));

app.listen(PORT, IP, () => info('SERVER', 'listening on ' + [IP, PORT].join(':')));
