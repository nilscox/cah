const { BadRequestError } = require('../../errors');
const { GameFormatter } = require('../../formatters');
const { isPlayer, isInGame, isNotInGame } = require('../../permissions');
const findGame = require('./find-game');

const router = require('../createRouter')();
module.exports = router.router;

router.param('id', findGame);

router.post('/:id/join', {
  authorize: [
    req => isPlayer(req.player),
    req => isNotInGame(req.player),
  ],
  formatter: GameFormatter.full,
}, async (req, res, next) => {
  await req.params.game.join(req.player);
  return req.params.game;
});

router.post('/:id/leave', {
  authorize: [
    req => isPlayer(req.player),
    req => isInGame(req.player, req.params.id),
  ],
}, async req => { await req.params.game.leave(req.player) });
