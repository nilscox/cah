const path = require('path');
const fs = require('fs-extra');
const { createLogger, format, transports } = require('winston');
const config = require('./config');

const { combine, timestamp, printf } = format;

fs.ensureDirSync(path.dirname(config.log.server));
fs.ensureDirSync(path.dirname(config.log.database));
fs.ensureDirSync(path.dirname(config.log.request));

const ignoreTestEnv = format((info) => {
  if (config.env === 'test')
    return false;

  return info;
});

// eslint-disable-next-line no-unused-vars
const server = module.exports = createLogger({
  level: 'debug',
  transports: [
    new transports.Console(),
    new transports.File({ filename: config.log.server, level: 'info' }),
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
    new transports.File({ filename: config.log.database }),
  ],
  format: format.combine(
    ignoreTestEnv(),
    format.splat(),
    format.simple()
  ),
});

const request = module.exports.request = createLogger({
  transports: [
    new transports.File({ filename: config.log.request }),
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
