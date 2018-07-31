const fs = require('fs');
const path = require('path');

const log = (level, tag, ...message) => {
  const match = new Date().toISOString().match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2}).\d+Z$/);
  const now = `${match[1]} ${match[2]}`

  if (process.env.NODE_ENV === 'production')
    console.log.call(console, `[${now}][${level}][${tag}]`, ...message);
  else
    console.log.call(console, `[${level}][${tag}]`, ...message);
};

module.exports = {
  log:   log.bind(null, 'LOG'),
  info:  log.bind(null, 'INF'),
  error: log.bind(null, 'ERR'),
};
