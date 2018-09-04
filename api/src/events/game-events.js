const { gameFormatter, playerFormatter, gameTurnFormatter } = require('../formatters');
const websockets = require('../websockets');
const events = require('./index');
const handle = require('./handle-event');


events.on('game:create', async (game, data) => {
  websockets.join(game, await game.getOwner());

  return handle('GAME_CREATE')
    .admin({ game: await gameFormatter.admin(game) })
    .log(game, JSON.stringify(data));
});

events.on('game:update', async (game, data) => handle('GAME_UPDATE')
  .admin({ game: await gameFormatter.admin(game) })
  .log(game, JSON.stringify(data))
);

events.on('game:delete', async (game) => handle('GAME_DELETE')
  .admin({ game: await gameFormatter.admin(game) })
  .log(game)
);

events.on('game:join', async (game, player) => {
  websockets.join(game, player);

  return handle('GAME_JOIN')
    .admin({
      game: await gameFormatter.admin(game),
      player: await playerFormatter.admin(player),
    })
    .broadcastGame(game, {
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
    .broadcastGame(game, {
      game: await gameFormatter.full(game),
      player: await playerFormatter.light(player),
    })
    .log(game, player);
});

events.on('game:start', async (game) => handle('GAME_START')
  .admin({ game: await gameFormatter.admin(game) })
  .broadcastGame(game, { game: await gameFormatter.full(game) })
  .log(game)
);

events.on('game:answer', async (game, player, answer) => {
  handle('GAME_ANSWER')
    .admin({ game: await gameFormatter.admin(game) })
    .broadcastGame(game, { player: player.get('nick') })
    .log(game, player, answer);

  if (await game.getPlayState() === 'question_master_selection') {
    handle('GAME_ALL_ANSWERS')
      .admin({ game: await gameFormatter.admin(game) })
      .broadcastGame(game, { game: await gameFormatter.full(game) })
      .log(game);
  }
});

events.on('game:select', async (game, player, answer) => handle('GAME_SELECT')
  .admin({ game: await gameFormatter.admin(game) })
  .broadcastGame(game, { game: await gameFormatter.full(game) })
  .log(game, player, answer)
);

events.on('game:turn', async (game, turn) => {
  handle('GAME_TURN')
    .admin({ gameId: game.id, turn: await gameTurnFormatter.admin(turn) })
    .broadcastGame(game, { turn: await gameTurnFormatter.full(turn) })
    .log(game, turn);
});

events.on('game:next', async (game) => handle('GAME_NEXT')
  .admin({ game: await gameFormatter.admin(game) })
  .broadcastGame(game, { game: await gameFormatter.full(game) })
  .log(game)
);

events.on('game:end', async (game) => handle('GAME_END')
  .admin({ game: await gameFormatter.admin(game) })
  .broadcastGame(game, { game: await gameFormatter.full(game) })
  .log(game)
);
