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
}, async (req, res, data) => {
  const player = await Player.findOne({ where: { nick: data.nick } })

  if (!player)
    throw new NotFoundError('player');

  req.session.playerId = player.id;
  info('PLAYER', 'login', '#' + player.id, '(' + player.nick + ')');
  websockets.admin('PLAYER_LOGIN', await playerFormatter.admin(player));

  return player;
});

router.post('/logout', {
  authorize: [
    req => isNotAdmin(req.admin),
    req => isPlayer(req.player),
  ],
}, async req => {
  const { player } = req;

  delete req.session.playerId;
  info('PLAYER', 'logout', '#' + player.id, '(' + player.nick + ')');
  websockets.admin('PLAYER_LOGOUT', await playerFormatter.admin(player));
});
