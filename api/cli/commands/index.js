const player = require('./player');
const game = require('./game');

module.exports = {};

Object.keys(player).forEach(cmd => module.exports['player:' + cmd] = player[cmd]);
Object.keys(game).forEach(cmd => module.exports['game:' + cmd] = game[cmd]);
