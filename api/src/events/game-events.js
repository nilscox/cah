const { gameFormatter, playerFormatter, gameTurnFormatter } = require('../formatters');
const websockets = require('../websockets');
const events = require('./index');
const handle = require('./handle-event');


events.on('game:create', async (game, data) => {
  websockets.join(game, await game.getOwner());

  return handle('GAME_CREATE')
    .admin({ game: await gameFormatter.admin(game) })
    .log(data);
});

events.on('game:update', async (game, data) => handle('GAME_UPDATE')
  .admin({ game: await gameFormatter.admin(game) })
  .log(data)
);

events.on('game:delete', async (game) => handle('GAME_DELETE')
  .admin({ game: await gameFormatter.admin(game) })
);

events.on('game:join', async (game, player) => {
  websockets.join(game, player);

  return handle('GAME_JOIN')
    .admin({
      game: await gameFormatter.admin(game),
      player: await playerFormatter.admin(player),
    })
    .broadcastGame({
      game: await gameFormatter.full(game),
      player: await playerFormatter.light(player),
    })
    .log(game, player);
});

events.on('game:leave', async (game, player) => {
  websockets.leave(game, player);

  return handle('GAME_LEAVE')
    .admin({
      game: await gameFormatter.admin(game),
      player: await playerFormatter.admin(player),
    })
    .broadcastGame({
      game: await gameFormatter.full(game),
      player: await playerFormatter.light(player),
    })
    .log(game, player);
});

events.on('game:start', async (game) => handle('GAME_START')
  .admin({ game: await gameFormatter.admin(game) })
  .broadcastGame({ game: await gameFormatter.full(game) })
);

events.on('game:answer', async (game, player, data) => {
  handle('GAME_ANSWER')
    .admin({ game: await gameFormatter.admin(game) })
    .broadcastGame({ player: player.get('nick') })
    .log(data);

  if (await game.getPlayState() === 'question_master_selection') {
    handle('GAME_ALL_ANSWERS')
      .admin({ game: await gameFormatter.admin(game) })
      .broadcastGame({ game: await gameFormatter.full(game) })
      .log(data);
  }
});

events.on('game:select', async (game, player, data) => handle('GAME_SELECT')
  .admin({ game: await gameFormatter.admin(game) })
  .broadcastGame({ game: await gameFormatter.full(game) })
  .log(data)
);

events.on('game:next', async (game) => {
  const turn = (await game.getTurns({ order: [['createdAt', 'DESC']], limit: 1 }))[0];

  handle('GAME_TURN')
    .admin({ gameId: game.id, turn: await gameTurnFormatter.admin(turn) })
    .broadcastGame({ turn: await gameTurnFormatter.full(turn) })
    .log({ number: turn.number });

  handle(game.state === 'started' ? 'GAME_NEXT' : 'GAME_END')
    .admin({ game: await gameFormatter.admin(game) })
    .broadcastGame({ game: await gameFormatter.full(game) });
});
