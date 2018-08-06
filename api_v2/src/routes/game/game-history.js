const { Game } = require('../../models');
const { GameTurnFormatter } = require('../../formatters');
const { isNotPlayer, isPlayer } = require('../../permissions');

const router = require('../createRouter')();
module.exports = router.router;

router.get('/:id/history', {
  authorize: [
    req => isPlayer(req.player),
    req => isInGame(req.player, req.params.id),
  ],
  formatter: GameTurnFormatter.full,
}, async (req, res, next) => {
  return await req.game.getTurns({
    include: ['winner'],
  });
});