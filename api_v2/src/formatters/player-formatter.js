const Formatter = require('./formatter');

class PlayerFormatter extends Formatter {

  constructor() {
    super(['nick', 'avatar']);
  }

};

module.exports = PlayerFormatter;
