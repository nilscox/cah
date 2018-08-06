const { NotFoundError, MissingFieldError } = require('../../errors');
const { Player } = require('../../models');
const { isNotPlayer, isPlayer } = require('../../permissions');
const { PlayerFormatter } = require('../../formatters');

const router = require('../createRouter')();
module.exports = router.router;

router.post('/login', {
  authorize: req => isNotPlayer(req.player),
  validator: req => {
    const { nick } = req.body;

    if (!nick)
      throw new MissingFieldError('nick');

    return { nick };
  },
  formatter: PlayerFormatter.full,
}, async (req, res, data) => {
  const player = await Player.findOne({ where: { nick: data.nick } })

  if (!player)
    throw new NotFoundError('player');

  req.session.player = player.nick;

  return player;
});

router.post('/logout', {
  authorize: req => isPlayer(req.player),
}, req => delete req.session.player);
