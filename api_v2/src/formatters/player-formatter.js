const Formatter = require('./formatter');

class PlayerFormatter extends Formatter {

  constructor() {
    super({
      nick: player => player.get('nick'),
      avatar: player => player.get('avatar'),
    });
  }

};

module.exports = PlayerFormatter;
