const { info } = require('../log');
const websockets = require('../websockets');

module.exports = (type) => {
  const handler = {};

  handler.admin = (message) => {
    websockets.admin(type, message);
    return handler;
  };

  handler.sendPlayer = (player, message) => {
    if (player)
      websockets.send(player, type, message);

    return handler;
  };

  handler.broadcastGame = (game, message) => {
    if (game)
      websockets.broadcast(game, type, message);

    return handler;
  };

  handler.log = (...args) => {
    info(type, ...args);
    return handler;
  };

  return handler;
};
