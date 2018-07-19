const { Player } = require('../../models');
const { NotFoundError } = require('../../errors');
const router = require('./router');

router.post('/login', (req, res, next) => {
  const { nick } = req.body;

  Player.findOne({ where: { nick } })
    .then(player => {
      if (!player)
        return next(new NotFoundError('player'));

      req.session.player = player.nick;
      res.json(player);
    });
});

router.post('/logout', (req, res, next) => {
  if (!req.session.player)
    return next();

  delete req.session.player;
  res.status(204).end();
});
