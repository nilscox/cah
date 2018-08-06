const router = require('./router');
const { InvalidFieldTypeError, BadRequestError } = require('../../errors');
const { Game } = require('../../models');
const { GameValidator } = require('../../validators');
const { GameFormatter } = require('../../formatters');

router.post('/:id/start', async (req, res, next) => {
  try {
    if (req.game.state !== 'idle')
      throw new BadRequestError('game has already started');

    const { questions } = req.body;

    if (questions && typeof questions !== 'number')
      throw new InvalidFieldTypeError('questions', 'number');

    await req.game.start({ questions });

    res.json(await GameFormatter.full(req.game));
  } catch (e) {
    next(e);
  }
});
