const { NotFoundError, MissingFieldError } = require('../../errors');
const { Player } = require('../../models');
const { isNotAdmin, isNotPlayer, isPlayer } = require('../../permissions');
const { playerFormatter } = require('../../formatters');
const events = require('../../events');
const findPlayer = require('./find-player');

const router = require('../createRouter')();
module.exports = router.router;

router.param('nick', findPlayer);

router.post('/login', {
  authorize: [
    req => isNotAdmin(req.admin),
    req => isNotPlayer(req.player),
  ],
  validate: req => {
    const { nick } = req.body;

    if (!nick)
      throw new MissingFieldError('nick');

    return { nick };
  },
  format: (req, value) => playerFormatter.full(value),
  after: (req, player) => events.emit('player login', player),
}, async ({ session, validated }) => {
  const player = await Player.findOne({ where: { nick: validated.nick } })

  if (!player)
    throw new NotFoundError('player');

  session.playerId = player.id;

  return player;
});

router.post('/logout', {
  authorize: [
    req => isNotAdmin(req.admin),
    req => isPlayer(req.player),
  ],
  after: (req) => events.emit('player logout', req.player),
}, async ({ session }) => {
  delete session.playerId;
});
