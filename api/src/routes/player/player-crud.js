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
  after: async ({ validated }, player) => {
    websockets.admin('PLAYER_CREATE', { player: await playerFormatter.admin(player) });
    info('PLAYER', 'created', '#' + player.id, validated);
  },
}, async ({ session, admin, validated }, res) => {
  const player = await Player.create(validated);

  if (!admin)
    session.playerId = player.id;

  res.status(201);

  return player;
});

router.put('/:nick', {
  authorize: [
    req => isPlayer(req.player, req.params.nick),
  ],
  validate: playerValidator.body({
    partial: true,
    nick: { readOnly: true },
  }),
  format: format(),
  after: async ({ validated }, player) => {
    websockets.admin('PLAYER_UPDATE', { player: await playerFormatter.admin(player) });
    info('PLAYER', 'updated', '#' + player.id, validated);
  },
}, async ({ validated }, res, { player }) => {
  return await player.update(validated);
});

router.delete('/:nick', {
  authorize: [
    req => isPlayer(req.player, req.params.nick),
    req => isNotInGame(req.player),
  ],
  after: async ({ params }) => {
    const { player } = params;

    websockets.admin('PLAYER_DELETE', { player: await playerFormatter.admin(player) });
    info('PLAYER', 'delete', '#' + player.id);
  },
}, async ({ session, admin }, res, { player }) => {
  await player.destroy();

  if (!admin)
    delete session.playerId;
});
