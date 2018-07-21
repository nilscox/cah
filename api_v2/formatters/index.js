const PlayerFormatter = require('./player-formatter');
const GameFormatter = require('./game-formatter');

module.exports = {
  PlayerFormatter: new PlayerFormatter(),
  GameFormatter: new GameFormatter(),
};
