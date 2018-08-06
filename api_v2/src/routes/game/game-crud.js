const router = require('./router');
const { Game } = require('../../models');
const { GameValidator } = require('../../validators');
const { GameFormatter } = require('../../formatters');

router.get('/', async (req, res, next) => {
  try {
    const games = await Game.findAll({
      include: 'owner',
    });

    res.json(await GameFormatter.full(games, { many: true }));
  } catch (e) {
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    res.json(await GameFormatter.full(req.game));
  } catch (e) {
    next(e);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const data = await GameValidator.validate(req.body);
    const game = await Game.create({ ...data, ownerId: req.player.id });

    await game.join(req.player);

    res.status(201).json(await GameFormatter.full(game));
  } catch (e) {
    next(e);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const data = await GameValidator.validate(req.body, { partial: true, lang: { readOnly: true } });

    await req.game.update(game);

    res.json(await GameFormatter.full(game));
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await req.game.destroy();
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});
