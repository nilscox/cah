const { Player, sequelize } = require('../../models');
const { PlayerValidator } = require('../../validators');
const { PlayerFormatter } = require('../../formatters');
const { ValidationError, NotFoundError } = require('../../errors');
const router = require('./router');

router.param('nick', async (req, res, next, nick) => {
  try {
    const player = await Player.findOne({
      where: { nick: nick },
      include: ['game'],
    });

    if (!player)
      throw new NotFoundError('player');

    req.player = player;
    next();
  } catch (e) {
    next(e);
  }
});

router.get('/list', async (req, res, next) => {
  try {
    const players = await Player.findAll({ include: ['game'] });

    res.json(await PlayerFormatter.full(players, { many: true }));
  } catch (e) {
    next(e);
  }
});

router.get('/', async (req, res, next) => {
  if (!req.player)
    return next();

  res.json(await PlayerFormatter.full(req.player));
});

router.get('/:nick', async (req, res) => {
  res.json(await PlayerFormatter.full(req.player));
});

router.post('/', async (req, res, next) => {
  try {
    const data = await PlayerValidator.validate(req.body);
    const player = await Player.create(data);

    req.session.player = player.nick;

    res.status(201).json(await PlayerFormatter.full(player));
  } catch (e) {
    next(e);
  }
});

router.put('/:nick', async (req, res, next) => {
  try {
    const data = await PlayerValidator.validate(req.body, {
      partial: true,
      nick: { readOnly: true },
    });

    const player = await req.player.update(data);

    res.json(await PlayerFormatter.full(player));
  } catch (e) {
    next(e);
  }
});

router.delete('/:nick', async (req, res, next) => {
  try {
    await req.player.destroy();
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});
