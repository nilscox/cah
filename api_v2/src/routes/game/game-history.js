const { Game } = require('../../models');
const { gameTurnFormatter } = require('../../formatters');
const { isPlayer, isInGame } = require('../../permissions');
const findGame = require('./find-game');

const router = require('../createRouter')();
module.exports = router.router;

router.param('id', findGame);

router.get('/:id/history', {
  authorize: [
    req => isPlayer(req.player),
    req => isInGame(req.player, req.params.id),
  ],
  format: gt => gameTurnFormatter.full(gt, { many: true }),
}, async (req, res, next) => {
  return await req.params.game.getTurns({
    include: ['questionMaster', 'winner', 'question', 'answers'],
  });
});
