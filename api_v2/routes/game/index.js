const { Game } = require('../../models');
const { NotFoundError } = require('../../errors');

const router = require('./router');

router.param('id', (req, res, next, id) => {
  Game.findOne({
    where: { id },
    include: ['players', 'owner']
  })
    .then(game => {
      if (!game)
        throw new NotFoundError('game');

      req.game = game;
      next();
    })
    .catch(next);
});

require('./game-crud');
require('./game-history');
require('./game-players');

module.exports = router;
