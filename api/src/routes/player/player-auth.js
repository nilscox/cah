const { NotFoundError, MissingFieldError } = require('../../errors');
const { Player } = require('../../models');
const { isNotAdmin, isNotPlayer, isPlayer } = require('../../permissions');
const { playerFormatter } = require('../../formatters');
const { info } = require('../../utils');
const websockets = require('../../websockets');
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
  after: async (req, player) => {
    websockets.admin('PLAYER_LOGIN', { player: await playerFormatter.admin(player) });
    info('PLAYER', 'login', '#' + player.id, '(' + player.nick + ')');
  },
}, async (req, res, data) => {
  const player = await Player.findOne({ where: { nick: data.nick } })

  if (!player)
    throw new NotFoundError('player');

  req.session.playerId = player.id;

  return player;
});

router.post('/logout', {
  authorize: [
    req => isNotAdmin(req.admin),
    req => isPlayer(req.player),
  ],
  after: async (req) => {
    const { player } = req;

    websockets.admin('PLAYER_LOGOUT', { player: await playerFormatter.admin(player) });
    info('PLAYER', 'logout', '#' + player.id, '(' + player.nick + ')');
  },
}, async req => {
  delete req.session.playerId;
});
