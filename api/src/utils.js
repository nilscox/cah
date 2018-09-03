const path = require('path');
const config = require('./config');

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
  return url(config.mediaRoot, ...path);
};

const mediaPath = (...dirs) => {
  return path.join(config.mediaPath, ...dirs);
};

module.exports = {
  mediaUrl,
  mediaPath,
};
