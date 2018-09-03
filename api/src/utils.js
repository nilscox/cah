const path = require('path');

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

const url = (...path) => {
  if (typeof path === 'string')
    path = path.split('/');

  return '/' + path.map(part => {
    if (part.startsWith('/'))
      part = part.slice(1);

    if (part.endsWith('/'))
      part = part.slice(0, -1);

    return part;
  }).join('/');
};

const mediaUrl = (...path) => {
  return url(getEnv('CAH_MEDIA_ROOT'), ...path);
};

const mediaPath = (...dirs) => {
  return path.join(getEnv('CAH_MEDIA_PATH'), ...dirs);
};

module.exports = {
  getEnv,
  mediaUrl,
  mediaPath,
};
