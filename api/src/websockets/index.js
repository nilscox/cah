const WSServer = require('socket.io');
const sharedSession = require('express-socket.io-session');

const events = require('../events');

let io = null;

module.exports = (http, session) => {
  io = new WSServer(http);

  io.use(sharedSession(session, {
    autoSave: true,
  }));

  io.on('connection', async socket => {
    const { session } = socket.handshake;

    if (session.admin)
      socket.join('admin');
    else if (session.playerId) {
      events.emit('player:connect', session.playerId, socket);

      socket.on('disconnect', () => {
        events.emit('player:disconnect', session.playerId, socket);
      });
    }
  });
};

module.exports.send = (player, type, message) => {
  io.to(player.socket).send({ type, ...message });
};

module.exports.broadcast = (game, type, message) => {
  io.to('game-' + game.id).send({ type, ...message });
};

module.exports.admin = (type, message) => {
  io.to('admin').send({ type, ...message });
};

module.exports.join = (game, player) => {
  const socket = io.sockets.connected[player.socket];

  if (socket)
    socket.join('game-' + game.id);
};

module.exports.leave = (game, player) => {
  const socket = io.sockets.connected[player.socket];

  if (socket)
    socket.leave('game-' + game.id);
};
