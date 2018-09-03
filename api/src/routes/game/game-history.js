const { gameTurnFormatter } = require('../../formatters');
const { isAdmin, isPlayer, isInGame } = require('../../permissions');
const findGame = require('./find-game');

const router = require('../createRouter')();
module.exports = router.router;

router.param('id', findGame);

router.get('/:id/history', {
  authorize: { or: [
    req => isAdmin(req.admin),
    [
      req => isPlayer(req.player),
      req => isInGame(req.player, req.params.id),
    ],
  ]},
  format: (req, gt) => gameTurnFormatter.full(gt, { many: true }),
}, async (req) => {
  return await req.params.game.getTurns({
    include: ['questionMaster', 'winner', 'question', 'answers'],
  });
});
