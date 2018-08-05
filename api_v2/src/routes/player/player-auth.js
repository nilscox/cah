const { NotFoundError, MissingFieldError } = require('../../errors');
const { PlayerFormatter } = require('../../formatters');
const { Player } = require('../../models');
const router = require('./router');

router.post('/login', async (req, res, next) => {
  const { nick } = req.body;

  if (!nick)
    return next(new MissingFieldError('nick'))

  try {
    const player = await Player.findOne({ where: { nick } })

    if (!player)
      return next(new NotFoundError('player'));

    req.session.player = player.nick;
    res.json(await PlayerFormatter.full(player));
  } catch (e) {
    next(e);
  }
});

router.post('/logout', (req, res, next) => {
  delete req.session.player;
  res.status(204).end();
});
