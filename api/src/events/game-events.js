const { error, info } = require('../utils');
const { gameFormatter, playerFormatter, gameTurnFormatter } = require('../formatters');
const websockets = require('../websockets');

const on_event = async (type, game, { msgAdmin, msgPlayers, ...args }) => {
  try {
    if (msgAdmin)
      websockets.admin(type, await msgAdmin());

    if (msgPlayers)
      websockets.broadcast(game, type, await msgPlayers());

    info(type, '#' + game.id, args);
  } catch (e) {
    error('EVENT', e);
  }
};

module.exports.on_create = async (game, data) => {
  websockets.join(game, await game.getOwner());

  return on_event('GAME_CREATE', game, {
    msgAdmin: async () => ({ game: await gameFormatter.admin(game) }),
    data,
  });
};

module.exports.on_update = (game, data) => on_event('GAME_UPDATE', game, {
  msgAdmin: async () => ({ game: await gameFormatter.admin(game) }),
  data,
});

module.exports.on_delete = (game) => on_event('GAME_DELETE', game, {
  msgAdmin: async () => ({ game: await gameFormatter.admin(game) }),
});

module.exports.on_join = (game, player) => {
  websockets.join(game, player);

  return on_event('GAME_JOIN', game, {
    msgAdmin: async () => ({
      game: await gameFormatter.admin(game),
      player: await playerFormatter.admin(player),
    }),
    msgPlayers: async () => ({
      game: await gameFormatter.full(game),
      player: await playerFormatter.light(player),
    }),
    nick: player.nick,
  });
};

module.exports.on_leave = (game, player) => {
  websockets.leave(game, player);

  return on_event('GAME_LEAVE', game, {
    msgAdmin: async () => ({
      game: await gameFormatter.admin(game),
      player: await playerFormatter.admin(player),
    }),
    msgPlayers: async () => ({
      game: await gameFormatter.full(game),
      player: await playerFormatter.light(player),
    }),
    nick: player.nick,
  });
};

module.exports.on_start = (game) => on_event('GAME_START', game, {
  msgAdmin: async () => ({ game: await gameFormatter.admin(game) }),
  msgPlayers: async () => ({ game: await gameFormatter.full(game) }),
});

module.exports.on_answer = (game, data) => on_event('GAME_ANSWER', game, {
  msgAdmin: async () => ({ game: await gameFormatter.admin(game) }),
  msgPlayers: async () => ({ game: await gameFormatter.full(game) }),
  data,
});

module.exports.on_select = (game, data) => on_event('GAME_SELECT', game, {
  msgAdmin: async () => ({ game: await gameFormatter.admin(game) }),
  msgPlayers: async () => ({ game: await gameFormatter.full(game) }),
  data,
});

module.exports.on_next = async (game) => {
  const turn = (await game.getTurns({ order: [['createdAt', 'DESC']], limit: 1 }))[0];

  on_event('GAME_TURN', game, {
    msgAdmin: async () => ({ gameId: game.id, turn: await gameTurnFormatter.admin(turn) }),
    msgPlayers: async () => ({ turn: await gameTurnFormatter.full(turn) }),
    number: turn.number,
  });

  on_event(game.state === 'started' ? 'GAME_NEXT' : 'GAME_END', game, {
    msgAdmin: async () => ({ game: await gameFormatter.admin(game) }),
    msgPlayers: async () => ({ game: await gameFormatter.full(game) }),
  });
};
