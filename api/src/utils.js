const fs = require('fs');
const path = require('path');

const getEnv = (key, defaultValue) => {
  const value = process.env[key];

  if (value !== undefined)
    return value;

  if (defaultValue !== undefined)
    return defaultValue;

  try { throw new Error('missing env: ' + key) }
  catch (e) { log('FATAL', 'ENV', e) }
  finally { process.exit(1) }
};

const mediaPath = (file) => {
  const MEDIA_ROOT = getEnv('CAH_MEDIA_ROOT');

  return path.join(MEDIA_ROOT, file);
}

const log = (level, tag, ...message) => {
  const match = new Date().toISOString().match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2}).\d+Z$/);
  const now = `${match[1]} ${match[2]}`

  if (getEnv('NODE_ENV', null) === 'production')
    console.log.call(console, `[${now}][${level}][${tag}]`, ...message);
  else if (getEnv('NODE_ENV', null) === 'development')
    console.log.call(console, `[${level}][${tag}]`, ...message);
  else if (getEnv('NODE_ENV', null) === 'test' && level === 'FATAL')
    console.log.call(console, `[${level}][${tag}]`, ...message);
  else if (false)
    console.log.call(console, `[${level}][${tag}]`, ...message);
};

module.exports = {
  getEnv,
  mediaPath,
  log: log.bind(null, 'LOG'),
  info: log.bind(null, 'INF'),
  error: log.bind(null, 'ERR'),
};
