const WSServer = require('socket.io');
const sharedSession = require('express-socket.io-session');

const { error } = require('../utils');

let io = null;

module.exports = (http, session) => {
  io = new WSServer(http);

  io.use(sharedSession(session, {
    autoSave: true,
  }));

  io.on('connection', async socket => {
    try {
      const { session } = socket.handshake;

      if (session.admin)
        socket.join('admin');
      else if (session.playerId) {
        const player = await Player.findOne({ where: { id: session.playerId } });

        if (player && player.gameId)
          player.join('game-' + player.gameId);
      }
    } catch (e) {
      error(e);
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

module.exports.join = (player, game) => {
  io.to(player.socket).join('game-' + game.id);
};

module.exports.leave = (player, game) => {
  io.to(player.socket).leave('game-' + game.id);
};
