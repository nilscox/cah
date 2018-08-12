const { Player } = require('../../models');
const { playerValidator } = require('../../validators');
const { playerFormatter } = require('../../formatters');
const { ValidationError, NotFoundError } = require('../../errors');
const { allow, isAdmin, isNotPlayer, isPlayer, isNotInGame } = require('../../permissions');
const { info } = require('../../utils');
const websockets = require('../../websockets');
const findPlayer = require('./find-player');

const router = require('../createRouter')();
module.exports = router.router;

const format = opts => (req, value) => {
  if (req.admin)
    return playerFormatter.admin(value, opts);

  if (req.player && req.params.player && req.player.equals(req.params.player))
    return playerFormatter.full(value, opts);

  return playerFormatter.light(value, opts);
};

router.param('nick', findPlayer);

router.get('/', {
  authorize: allow,
  format: format({ many: true }),
}, async () => await Player.findAll());

router.get('/me', {
  authorize: req => isPlayer(req.player),
  format: (req, value) => playerFormatter.full(value),
}, req => req.player);

router.get('/:nick', {
  authorize: allow,
  format: format(),
}, req => req.params.player);

router.post('/', {
  authorize: [{
    or: [
      req => isAdmin(req.admin),
      req => isNotPlayer(req.player),
    ],
  }],
  validate: playerValidator.body({ avatar: { required: false } }),
  format: format(),
  after: async (req, player) => {
    websockets.admin('PLAYER_CREATE', await playerFormatter.admin(player));
    info('PLAYER', 'created', '#' + player.id, '(' + player.nick + ')');
  },
}, async (req, res, data) => {
  const player = await Player.create(data);

  if (!req.admin)
    req.session.playerId = player.id;

  res.status(201);

  return player;
});

router.put('/:nick', {
  authorize: {
    or: [
      req => isAdmin(req.admin),
      req => isPlayer(req.player, req.params.nick),
    ],
  },
  validate: playerValidator.body({
    partial: true,
    nick: { readOnly: true },
  }),
  format: format(),
  after: async (req, player) => {
    websockets.admin('PLAYER_UPDATE', await playerFormatter.admin(player));
    info('PLAYER', 'updated', '#' + player.id, data);
  },
}, async (req, res, data) => {
  return await req.params.player.update(data);
});

router.delete('/:nick', {
  authorize: [
    {
      or: [
        req => isAdmin(req.admin),
        req => isPlayer(req.player, req.params.nick),
      ],
    },
    req => isNotInGame(req.params.player),
  ],
  after: async (req) => {
    const { player } = req.params;

    websockets.admin('PLAYER_DELETE', await playerFormatter.admin(player));
    info('PLAYER', 'delete', '#' + player.id);
  },
}, async (req, res, next) => {
  const { player } = req.params;

  await player.destroy();

  if (!req.admin)
    delete req.session.playerId;
});
