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
  const { game } = req;

  try {
    if (game.state !== 'started')
      throw new BadRequestError('game is not started');

    if (game.questionMasterId === req.player.id)
      throw new BadRequestError('you must not be the question master');

    if (await game.getPlayState() !== 'players_answer')
      throw new BadRequestError('you cannot sumbit an answer');

    const ids = req.body.ids || req.body.id && [req.body.id];
    console.log(ids);

    if (!ids)
      throw new MissingFieldError('id | ids');

    if (!(ids instanceof Array) || ids.map(id => typeof id !== 'number').indexOf(true) >= 0)
      throw new InvalidFieldTypeError('id | ids', 'number | number[]');

    const choices = await req.player.getCards({
      where: {
        id: { [Op.in]: ids },
      },
    });

    if (ids.length !== choices.length)
      throw new BadRequestError('invalid id | ids');

    const question = await game.getCurrentQuestion();

    if (choices.length !== question.getNbChoices())
      throw new BadRequestError('invalid number of answers');

    await game.answer(req.player, choices);

    res.json(await GameFormatter.full(game));
  } catch (e) {
    next(e);
  }
});

router.post('/:id/select', async (req, res, next) => {
  const { game } = req;

  try {
    if (game.state !== 'started')
      throw new BadRequestError('game is not started');

    if (game.questionMasterId !== req.player.id)
      throw new BadRequestError('you must be the question master');

    if (await game.getPlayState() !== 'question_master_selection')
      throw new BadRequestError('you cannot sumbit an answer');

    const answerId = req.body.id;

    if (!answerId)
      throw new MissingFieldError('id');

    if (typeof answerId !== 'number')
      throw new InvalidFieldTypeError('id', 'number');

    const propositions = await game.getPropositions();
    const answer = propositions.filter(p => p.id === answerId)[0];

    if (!answer)
      throw new BadRequestError('invalid answer id');

    await game.select(answer);

    res.json(await GameFormatter.full(game));
  } catch (e) {
    next(e);
  }
});

router.post('/:id/next', async (req, res, next) => {
  const { game } = req;

  try {
    if (game.state !== 'started')
      throw new BadRequestError('game is not started');

    if (game.questionMasterId !== req.player.id)
      throw new BadRequestError('you must be the question master');

    if (await game.getPlayState() !== 'end_of_turn')
      throw new BadRequestError('you cannot go next yet');

    await game.nextTurn();

    res.json(await GameFormatter.full(game));
 } catch (e) {
    next(e);
 }
});
