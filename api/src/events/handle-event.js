const { info } = require('../log');
const websockets = require('../websockets');

module.exports = (type) => {
  const handler = {};

  handler.admin = (message) => {
    websockets.admin(type, message);
    return handler;
  };

  handler.sendPlayer = (player, message) => {
    websockets.send(player, type, message);
    return handler;
  };

  handler.broadcastGame = (game, message) => {
    websockets.broadcast(game, type, message);
    return handler;
  };

  handler.log = (...args) => {
    info(type, ...args);
    return handler;
  };

  return handler;
};
