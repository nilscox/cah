const Formatter = require('./formatter');

class GameFormatter extends Formatter {

  constructor() {
    super(['id', 'lang', 'owner']);
  }

  format_owner(player) {
    if (!player)
      return undefined;

    return player.get('nick');
  }

};

module.exports = GameFormatter;
