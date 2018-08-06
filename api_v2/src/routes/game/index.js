const router = require('express').Router();
const { NotFoundError } = require('../../errors');
const { Game } = require('../../models');

router.param('id', async (req, res, next, id) => {
  try {
    const game = await Game.findOne({
      where: { id },
      include: ['owner', {
        association: 'players',
        include: ['cards'],
      }],
    });

    if (!game)
      throw new NotFoundError('game');

    req.params.game = game;
    next();
  } catch (e) {
    next(e);
  }
});

router.use(require('./game-crud'));
router.use(require('./game-history'));
router.use(require('./game-players'));
router.use(require('./game-loop'));

module.exports = router;
