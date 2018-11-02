const multer  = require('multer');

const { mediaPath, mediaUrl } = require('../../utils');
const { Player } = require('../../models');
const { playerValidator } = require('../../validators');
const { playerFormatter } = require('../../formatters');
const { allow, isAdmin, isNotPlayer, isPlayer, isNotInGame } = require('../../permissions');
const events = require('../../events');
const findPlayer = require('./find-player');


const cleanupUndefined = obj => {
  Object.keys(obj).forEach(k => {
    if (obj[k] === undefined)
      delete obj[k];
  });

  return obj;
};

const router = require('../createRouter')();
module.exports = router.router;

const format = (full = false, opts) => (req, value) => {
  if (req.admin)
    return playerFormatter.admin(value, opts);

  if (full)
    return playerFormatter.full(value, opts);

  return playerFormatter.light(value, opts);
};

router.param('nick', findPlayer);

router.get('/', {
  authorize: allow,
  format: format(false, { many: true }),
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
  validate: req => playerValidator(req.body, {
    nick: { unique: true },
  }),
  format: format(true),
}, async ({ session, admin, validated }, res) => {
  const player = await Player.create(cleanupUndefined(validated));

  if (!admin)
    session.playerId = player.id;

  res.status(201);

  events.emit('player:create', player, validated);

  return player;
});

const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, mediaPath('avatars'));
  },
  filename: function (req, file, cb) {
    const ext = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
    };

    cb(null, [
      'avatar-', req.player.nick,
      '.', Math.random().toString(36).slice(-6),
      '.', ext[file.mimetype]
    ].join(''));
  },
});

const avatarUpload = multer({ storage: avatarStorage });

router.put('/:nick', {
  authorize: [
    req => isPlayer(req.player, req.params.nick),
  ],
  validate: req => playerValidator(req.body, {
    nick: { readOnly: true },
  }),
  format: format(true),
  middlewares: [
    avatarUpload.single('avatar'),
    (req, res, next) => {
      if (req.file)
        req.body.avatar = req.file;

      next();
    },
  ],
}, async ({ validated }, res, { player }) => {
  if (validated.avatar)
    validated.avatar = mediaUrl('avatars', validated.avatar);

  player = await player.update(cleanupUndefined(validated));

  events.emit('player:update', player, validated);

  return player;
});

router.delete('/:nick', {
  authorize: [
    req => isPlayer(req.player, req.params.nick),
    req => isNotInGame(req.player),
  ],
}, async ({ session, admin }, res, { player }) => {
  await player.destroy();

  if (!admin)
    delete session.playerId;

  events.emit('player:delete', player);
});
