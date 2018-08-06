const { BadRequestError } = require('../../errors');
const { GameFormatter } = require('../../formatters')

const router = require('../createRouter')();
module.exports = router.router;

router.post('/:id/join', {
  authorize: [
    req => isPlayer(req.player),
    req => isNotInGame(req.player),
  ],
  formatter: GameFormatter.full,
}, async (req, res, next) => {
  await req.game.join(req.player);
  return req.game;
});

router.post('/:id/leave', {
  authorize: [
    req => isPlayer(req.player),
    req => isInGame(req.player, req.params.id),
  ],
}, async req => await req.game.leave(req.player));
