const { Player } = require('../../models');
const { PlayerValidator } = require('../../validators');
const { PlayerFormatter } = require('../../formatters');
const { ValidationError, NotFoundError } = require('../../errors');
const { allow, isNotPlayer, isPlayer, isMe, isNotInGame } = require('../../permissions');
const createRouter = require('../createRouter');

const router = createRouter();
module.exports = router.router;

router.param('nick', async (req, res, next, nick) => {
  try {
    const player = await Player.findOne({
      where: { nick },
      include: ['game'],
    });

    if (!player)
      throw new NotFoundError('player');

    req.params.player = player;
    next();
  } catch (e) {
    next(e);
  }
});

router.get('/', {
  authorize: allow,
  formatter: PlayerFormatter.full,
}, async () => await Player.findAll());

router.get('/me', {
  authorize: isPlayer,
  formatter: PlayerFormatter.full,
}, req => req.player);

router.get('/:nick', {
  authorize: allow,
  formatter: PlayerFormatter.full,
}, req => req.params.player);

router.post('/', {
  authorize: isNotPlayer,
  validator: req => PlayerValidator.validate(req.body),
  formatter: PlayerFormatter.full,
}, async (req, res, data) => {
  const player = await Player.create(data);

  req.session.player = player.nick;
  res.status(201);

  return player;
});

router.put('/:nick', {
  authorize: isMe,
  validator: req => PlayerValidator.validate(req.body, {
    partial: true,
    nick: { readOnly: true },
  }),
  formatter: PlayerFormatter.full,
}, async (req, res, data) => await req.player.update(data));

router.delete('/:nick', {
  authorize: [isMe, isNotInGame],
}, async (req, res, next) => {
  await req.player.destroy();
  delete req.session.player;
});
