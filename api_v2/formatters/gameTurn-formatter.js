const Formatter = require('./formatter');

class GameTurnFormatter extends Formatter {

  constructor() {
    super(['id', 'gameId', 'winner']);
  }

  winner(player) {
    return player.nick;
  }

};

module.exports = GameTurnFormatter;
