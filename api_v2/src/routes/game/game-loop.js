const Op = require('sequelize').Op;
const router = require('./router');
const { InvalidFieldTypeError, BadRequestError, MissingFieldError } = require('../../errors');
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

router.post('/:id/answer', async (req, res, next) => {
  try {
    if (req.game.state !== 'started')
      throw new BadRequestError('game is not started');

    if (req.game.questionMasterId === req.player.id)
      throw new BadRequestError('you must not be the question master');

    const ids = req.body.ids || req.body.id && [req.body.id];

    if (!ids)
      throw new MissingFieldError('id | ids');

    if (ids.map(id => typeof id !== 'number').indexOf(true) >= 0)
      throw new InvalidFieldTypeError('id | ids', 'number');

    const choices = await req.player.getCards({
      where: {
        id: { [Op.in]: ids },
      },
    });

    if (ids.length !== choices.length)
      throw new BadRequestError('invalid id | ids');

    const propositions = await req.game.getPropositions();

    if (choices.length !== propositions.length)
      throw new BadRequestError('invalid number of answers');

    await req.game.answer(req.player, choices);

    res.json(await GameFormatter.full(req.game));
  } catch (e) {
    next(e);
  }
});
