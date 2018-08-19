const { log, info } = require('../utils');
const { playerFormatter } = require('../formatters');
const websockets = require('../websockets');

const on_event = async (type, player, ...args) => {
  try {
    websockets.admin(type, { player: await playerFormatter.admin(player) });
    info(type, '#' + player.id, ...args);
  } catch (e) {
    log('EVENT', e);
  }
};

module.exports.on_create = (player, data) => on_event('PLAYER_CREATE', player, data);
module.exports.on_update = (player, data) => on_event('PLAYER_UPDATE', player, data);
module.exports.on_delete = (player) => on_event('PLAYER_DELETE', player);

module.exports.on_login = (player) => on_event('PLAYER_LOGIN', player);
module.exports.on_logout = (player) => on_event('PLAYER_LOGOUT', player);
