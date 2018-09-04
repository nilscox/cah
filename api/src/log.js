const path = require('path');
const fs = require('fs-extra');
const { createLogger, format, transports } = require('winston');
const config = require('./config');

const { combine, timestamp, printf } = format;

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
  ],
  format: combine(
    ignoreTestEnv(),
    timestamp(),
    printf(info => {
      const rest = info[Symbol.for('splat')].join(' ');
      return `${info.timestamp} [${info.level.toUpperCase()}] ${info.message}: ${rest}`;
    }),
  ),
});

if (config.log.server) {
  fs.ensureDirSync(path.dirname(config.log.server));
  server.add(new transports.File({ filename: config.log.server, level: 'info' }));
}

// eslint-disable-next-line no-unused-vars
const database = module.exports.database = createLogger({
  transports: [
    new transports.Stream({ stream: fs.createWriteStream('/dev/null') }),
  ],
  format: format.combine(
    ignoreTestEnv(),
    format.splat(),
    format.simple()
  ),
});

if (config.log.database) {
  fs.ensureDirSync(path.dirname(config.log.database));
  database.add(new transports.File({ filename: config.log.database, level: 'info' }));
}

const request = module.exports.request = createLogger({
  transports: [
    new transports.Stream({ stream: fs.createWriteStream('/dev/null') }),
  ],
  format: format.combine(
    ignoreTestEnv(),
    format.splat(),
    format.simple()
  ),
});

if (config.log.request) {
  fs.ensureDirSync(path.dirname(config.log.request));
  request.add(new transports.File({ filename: config.log.request, level: 'info' }));
}

request.stream = {
  write: function(message){
    request.info(message);
  },
};
