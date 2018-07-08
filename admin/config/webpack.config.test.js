'use strict';

const path = require('path');

module.exports = {
  entry: [
    require.resolve('./polyfills'),
    path.resolve(__dirname, '..', 'test/reducers/games.test.js'),
    path.resolve(__dirname, '..', 'test/reducers/players.test.js'),
  ],
  output: {
    filename: 'test/bundle.test.js',
  },
};
