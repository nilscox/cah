const { BadRequestError } = require('../../errors');
const { gameFormatter } = require('../../formatters');
const { isPlayer, isInGame, isNotInGame } = require('../../permissions');
const websockets = require('../../websockets');
const { info } = require('../../utils');
const findGame = require('./find-game');

const router = require('../createRouter')();
module.exports = router.router;

const format = opts => (req, value) => {
  if (req.admin)
    return gameFormatter.admin(value, opts);

  return gameFormatter.full(value, opts);
};

router.param('id', findGame);

router.post('/:id/join', {
  authorize: [
    req => isPlayer(req.player),
    req => isNotInGame(req.player),
  ],
  format: format(),
  after: async ({ player, params }) => {
    const { game } = params;

    websockets.admin('GAME_JOIN', { game: await gameFormatter.admin(game), playerId: player.id });
    info('GAME', 'join', '#' + game.id, '(' + player.nick + ')');
  },
}, async ({ player }, res, { game }) => {
  await game.join(player);
  return game;
});

router.post('/:id/leave', {
  authorize: [
    req => isPlayer(req.player),
    req => isInGame(req.player, req.params.id),
  ],
  after: async ({ player, params }) => {
    const { game } = params;

    websockets.admin('GAME_LEAVE', { game: await gameFormatter.admin(game), playerId: player.id });
    info('GAME', 'leave', '#' + game.id, '(' + player.nick + ')');
  },
}, async ({ player }, res, { game }) => {
  await game.leave(player);
});
