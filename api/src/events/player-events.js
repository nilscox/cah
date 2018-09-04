const { Player } = require('../models');
const { playerFormatter, choiceFormatter } = require('../formatters');
const websockets = require('../websockets');
const events = require('./index');
const handle = require('./handle-event');


events.on('player:create', async (player, data) => handle('PLAYER_CREATE')
  .admin({ player: await playerFormatter.admin(player) })
  .log(player, JSON.stringify(data))
);

events.on('player:update', async (player, data) => handle('PLAYER_UPDATE')
  .admin({ player: await playerFormatter.admin(player) })
  .broadcastGame(await player.getGame(), { player: await playerFormatter.light(player) })
  .log(player, JSON.stringify(data))
);

events.on('player:delete', async (player) => handle('PLAYER_DELETE')
  .admin({ player: await playerFormatter.admin(player) })
  .log(player)
);

events.on('player:login', async (player) => handle('PLAYER_LOGIN')
  .admin({ player: await playerFormatter.admin(player) })
  .log(player)
);

events.on('player:logout', async (player) => handle('PLAYER_LOGOUT')
  .admin({ player: await playerFormatter.admin(player) })
  .log(player)
);

events.on('player:connect', async (playerId, socket) => {
  const player = await Player.findById(playerId);

  if (!player)
    return;

  await player.update({ socket: socket.id });

  const game = await player.getGame();

  if (game)
    websockets.join(game, player);

  return handle('PLAYER_CONNECT')
    .admin({ player: await playerFormatter.admin(player) })
    .log(player);
});

events.on('player:disconnect', async (playerId) => {
  const player = await Player.findById(playerId);

  if (!player)
    return;

  // keep the socket id on disconnection because socket.io-client fails but the
  // socket is still valid
  // await player.update({ socket: null });

  return handle('PLAYER_DISCONNECT')
    .admin({ player: await playerFormatter.admin(player) })
    .log(player);
});

events.on('player:cards', async (player, cards, { initial }) => handle('CARDS_DEALT')
  .admin({ player: await playerFormatter.admin(player), cards, initial })
  .sendPlayer(player, { cards: await choiceFormatter.full(cards, { many: true }), initial })
  .log(player, cards)
);
