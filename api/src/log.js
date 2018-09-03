const path = require('path');
const fs = require('fs-extra');
const { createLogger, format, transports } = require('winston');
const { getEnv } = require('./utils');

const { combine, timestamp, printf } = format;

const NODE_ENV = getEnv('NODE_ENV');

fs.ensureDirSync(path.dirname(getEnv('CAH_API_LOG_SERVER')));
fs.ensureDirSync(path.dirname(getEnv('CAH_API_LOG_DATABASE')));
fs.ensureDirSync(path.dirname(getEnv('CAH_API_LOG_REQUEST')));

const ignoreTestEnv = format((info) => {
  if (NODE_ENV === 'test')
    return false;

  return info;
});

// eslint-disable-next-line no-unused-vars
const server = module.exports = createLogger({
  level: 'debug',
  transports: [
    new transports.Console(),
    new transports.File({ filename: getEnv('CAH_API_LOG_SERVER'), level: 'info' }),
  ],
  format: combine(
    ignoreTestEnv(),
    timestamp(),
    printf(info => {
      const rest = info[Symbol.for('splat')].map(i => typeof i === 'object' ? JSON.stringify(i) : i).join(' ');
      return `${info.timestamp} [${info.level.toUpperCase()}] ${info.message}: ${rest}`;
    }),
  ),
});

// eslint-disable-next-line no-unused-vars
const database = module.exports.database = createLogger({
  transports: [
    new transports.File({ filename: getEnv('CAH_API_LOG_DATABASE') }),
  ],
  format: format.combine(
    ignoreTestEnv(),
    format.splat(),
    format.simple()
  ),
});

const request = module.exports.request = createLogger({
  transports: [
    new transports.File({ filename: getEnv('CAH_API_LOG_REQUEST') }),
  ],
  format: format.combine(
    ignoreTestEnv(),
    format.splat(),
    format.simple()
  ),
});

request.stream = {
  write: function(message){
    request.info(message);
  },
};
