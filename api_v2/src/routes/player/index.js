const router = require('express').Router();
const { NotFoundError } = require('../../errors');
const { Player } = require('../../models');

router.param('nick', async (req, res, next, nick) => {
  try {
    const player = await Player.findOne({
      where: { nick },
      include: ['game'],
    });

    if (!player)
      throw new NotFoundError('player');

    req.params.player = player;
    next();
  } catch (e) {
    next(e);
  }
});

router.use(require('./player-crud'));
router.use(require('./player-auth'));

module.exports = router;
