const { Player } = require('../../models');
const { playerValidator } = require('../../validators');
const { playerFormatter } = require('../../formatters');
const { ValidationError, NotFoundError } = require('../../errors');
const { allow, isAdmin, isNotPlayer, isPlayer, isNotInGame } = require('../../permissions');
const findPlayer = require('./find-player');

const router = require('../createRouter')();
module.exports = router.router;

router.param('nick', findPlayer);

router.get('/', {
  authorize: allow,
  format: players => playerFormatter.full(players, { many: true }),
}, async () => await Player.findAll());

router.get('/me', {
  authorize: req => isPlayer(req.player),
  format: playerFormatter.full,
}, req => req.player);

router.get('/:nick', {
  authorize: allow,
  format: playerFormatter.full,
}, req => req.params.player);

router.post('/', {
  authorize: [{
    or: [
      req => isAdmin(req.admin),
      req => isNotPlayer(req.player),
    ],
  }],
  validate: playerValidator.body({ avatar: { required: false } }),
  format: playerFormatter.full,
}, async (req, res, data) => {
  const player = await Player.create(data);

  if (!req.admin)
    req.session.player = player.nick;

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
  format: playerFormatter.full,
}, async (req, res, data) => await req.params.player.update(data));

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
}, async (req, res, next) => {
  await req.params.player.destroy();

  if (!req.admin)
    delete req.session.player;
});
