const { NotFoundError, MissingFieldError } = require('../../errors');
const { PlayerFormatter } = require('../../formatters');
const { Player } = require('../../models');
const router = require('./router');

router.post('/login', (req, res, next) => {
  const { nick } = req.body;

  if (!nick)
    return next(new MissingFieldError('nick'))

  Player.findOne({ where: { nick } })
    .then(player => {
      if (!player)
        return next(new NotFoundError('player'));

      req.session.player = player.nick;
      res.format(PlayerFormatter, player);
    })
    .catch(next);
});

router.post('/logout', (req, res, next) => {
  delete req.session.player;
  res.status(204).end();
});
