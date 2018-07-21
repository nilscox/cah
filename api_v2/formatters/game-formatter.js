const Formatter = require('./formatter');

class GameFormatter extends Formatter {

  constructor() {
    super(['id', 'lang', 'owner']);
  }

  owner(player) {
    if (!player)
      return undefined;

    return player.get('nick');
  }

};

module.exports = GameFormatter;
