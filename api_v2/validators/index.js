const PlayerValidator = require('./player-validator');
const GameValidator = require('./game-validator');

module.exports = {
  PlayerValidator: new PlayerValidator(),
  GameValidator: new GameValidator(),
};
