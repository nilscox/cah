const { error, info } = require('../utils');
const { playerFormatter } = require('../formatters');
const websockets = require('../websockets');

const on_event = async (type, player, ...args) => {
  try {
    websockets.admin(type, { player: await playerFormatter.admin(player) });
    info(type, '#' + player.id, ...args);
  } catch (e) {
    error('EVENT', e);
  }
};

module.exports.on_create = (player, data) => on_event('PLAYER_CREATE', player, data);
module.exports.on_update = (player, data) => on_event('PLAYER_UPDATE', player, data);
module.exports.on_delete = (player) => on_event('PLAYER_DELETE', player);

module.exports.on_login = (player) => on_event('PLAYER_LOGIN', player);
module.exports.on_logout = (player) => on_event('PLAYER_LOGOUT', player);

module.exports.on_connect = async (player, socket) => {
  await player.update({ socket: socket.id });

  const game = await player.getGame();

  if (game)
    websockets.join(game, player);

  return await on_event('PLAYER_CONNECT', player);
};

module.exports.on_disconnect = async (player) => {
  await player.update({ socket: null });

  return await on_event('PLAYER_DISCONNECT', player)
};
