const { BadRequestError } = require('../../errors');
const { gameFormatter } = require('../../formatters');
const { isPlayer, isInGame, isNotInGame } = require('../../permissions');
const events = require('../../events');
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
  after: (req, game) => events.emit('game join', game, req.player),
}, async ({ player }, res, { game }) => {
  await game.join(player);
  return game;
});

router.post('/:id/leave', {
  authorize: [
    req => isPlayer(req.player),
    req => isInGame(req.player, req.params.id),
  ],
  after: (req, game) => events.emit('game leave', game, req.player),
}, async ({ player }, res, { game }) => {
  await game.leave(player);
});
