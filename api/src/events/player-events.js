const { error, info } = require('../utils');
const { playerFormatter, choiceFormatter } = require('../formatters');
const websockets = require('../websockets');

const on_event = async (type, player, { msgAdmin, msgPlayer, msgPlayers, ...args }) => {
  try {
    if (msgAdmin)
      websockets.admin(type, await msgAdmin());

    if (msgPlayer)
      websockets.send(player, type, await msgPlayer());

    if (msgPlayers) {
      const game = await player.getGame();

      if (game)
        websockets.broadcast(game, type, await msgPlayers());
    }

    info(type, '#' + player.id + ' (' + player.nick + ')', args);
  } catch (e) {
    error('EVENT', type, e);
  }
};

module.exports.on_create = (player, data) => on_event('PLAYER_CREATE', player, {
  msgAdmin: async () => ({ player: await playerFormatter.admin(player) }),
  data,
});

module.exports.on_update = (player, data) => on_event('PLAYER_UPDATE', player, {
  msgAdmin: async () => ({ player: await playerFormatter.admin(player) }),
  msgPlayers: async () => ({ player: await playerFormatter.light(player) }),
  data,
});

module.exports.on_delete = (player) => on_event('PLAYER_DELETE', player, {
  msgAdmin: async () => ({ player: await playerFormatter.admin(player) }),
});

module.exports.on_login = (player) => on_event('PLAYER_LOGIN', player, {
  msgAdmin: async () => ({ player: await playerFormatter.admin(player) }),
});

module.exports.on_logout = (player) => on_event('PLAYER_LOGOUT', player, {
  msgAdmin: async () => ({ player: await playerFormatter.admin(player) }),
});

module.exports.on_connect = async (player, socket) => {
  await player.update({ socket: socket.id });

  const game = await player.getGame();

  if (game)
    websockets.join(game, player);

  return on_event('PLAYER_CONNECT', player, {
    msgAdmin: async () => ({ player: await playerFormatter.admin(player) }),
  });
};

module.exports.on_disconnect = async (player) => {
  // keep the socket id on disconnection because socket.io-client fails but the
  // socket is still valid
  // await player.update({ socket: null });

  return on_event('PLAYER_DISCONNECT', player, {
    msgAdmin: async () => ({ player: await playerFormatter.admin(player) }),
  })
};

module.exports.on_cardsDealt = (player, cards) => {
  if (cards.length > 0) {
    return on_event('CARDS_DEALT', player, {
      msgAdmin: async () => ({ player: await playerFormatter.admin(player) }),
      msgPlayer: async () => ({ cards: await choiceFormatter.full(cards, { many: true }) }),
    });
  }
};
