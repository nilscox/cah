const fs = require('fs');
const path = require('path');

const getEnv = (key, defaultValue) => {
  const value = process.env[key];

  if (value)
    return value;

  if (defaultValue !== undefined)
    return defaultValue;

  try { throw new Error('missing env: ' + key) }
  catch (e) { log('FATAL', 'ENV', e) }
  finally { process.exit(1) }
};

const log = (level, tag, ...message) => {
  const match = new Date().toISOString().match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2}).\d+Z$/);
  const now = `${match[1]} ${match[2]}`

  if (getEnv('NODE_ENV', null) === 'production')
    console.log.call(console, `[${now}][${level}][${tag}]`, ...message);
  else
    console.log.call(console, `[${level}][${tag}]`, ...message);
};

module.exports = {
  getEnv,
  log: log.bind(null, 'LOG'),
  info: log.bind(null, 'INF'),
  error: log.bind(null, 'ERR'),
};