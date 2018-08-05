const { NotFoundError } = require('../../errors');
const { Game } = require('../../models');

const router = require('./router');

router.param('id', async (req, res, next, id) => {
  try {
    const game = await Game.findOne({
      where: { id },
      include: ['players', 'owner']
    });

    if (!game)
      throw new NotFoundError('game');

    req.game = game;
    next();
  } catch (e) {
    next(e);
  }
});

require('./game-crud');
require('./game-history');
require('./game-players');

module.exports = router;
