const formatter = require('./formatter');

module.exports = {
  full: formatter({
    nick: player => player.get('nick'),
    avatar: player => player.get('avatar'),
  }),
};
