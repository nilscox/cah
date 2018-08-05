const { Game } = require('../../models');
const { GameTurnFormatter } = require('../../formatters');
const router = require('./router');

router.get('/:id/history', async (req, res, next) => {
  try {
    const turns = await req.game.getTurns({
      include: ['winner'],
    });

    res.json(await GameTurnFormatter.full(turns, { many: true }));
  } catch (e) {
    next(e);
  }
});