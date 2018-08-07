const { InvalidFieldTypeError, BadRequestError, MissingFieldError } = require('../../errors');
const { Sequelize, Game } = require('../../models');
const { gameValidator } = require('../../validators');
const { gameFormatter } = require('../../formatters');
const { isPlayer, isGameOwner, isInGame, isGameState, isQuestionMaster, isNotQuestionMaster } = require('../../permissions');
const findGame = require('./find-game');

const router = require('../createRouter')();
module.exports = router.router;

const Op = Sequelize.Op;

router.param('id', findGame);

router.post('/:id/start', {
  authorize: [
    req => isPlayer(req.player),
    req => isGameOwner(req.player, req.params.id),
    req => {
      if (req.params.game.state !== 'idle')
        throw new BadRequestError('game has already started');
    },
  ],
  format: gameFormatter.full,
}, async (req, res) => {
  await req.params.game.start();
  return req.params.game;
});

router.post('/:id/answer', {
  authorize: [
    req => isPlayer(req.player),
    req => isInGame(req.player, req.params.id),
    req => isGameState(req.params.game, 'started', 'players_answer'),
    req => isNotQuestionMaster(req.player),
  ],
  validate: req => {
    let ids = req.body.ids || req.body.id;

    if (!ids)
      throw new MissingFieldError('id | ids');

    if (typeof ids === 'number')
      ids = [ids];

    if (!(ids instanceof Array))
      throw new InvalidFieldTypeError('id | ids', 'number | number[]');

    if (ids.map(id => typeof id !== 'number').indexOf(true) >= 0)
      throw new InvalidFieldTypeError('id | ids', 'number | number[]');

    return { ids };
  },
  format: gameFormatter.full,
}, async (req, res, { ids }) => {
  const { game } = req.params;

  const choices = await req.player.getCards({
    where: {
      id: { [Op.in]: ids },
    },
  });

  if (ids.length !== choices.length)
    throw new BadRequestError('invalid id | ids');

  const question = await game.getCurrentQuestion();

  if (choices.length !== question.getNbChoices())
    throw new BadRequestError('invalid number of choices');

  await game.answer(req.player, choices);

  return game;
});

router.post('/:id/select', {
  authorize: [
    req => isPlayer(req.player),
    req => isInGame(req.player, req.params.id),
    req => isGameState(req.params.game, 'started', 'question_master_selection'),
    req => isQuestionMaster(req.player),
  ],
  validate: req => {
    const answerId = req.body.id;

    if (!answerId)
      throw new MissingFieldError('id');

    if (typeof answerId !== 'number')
      throw new InvalidFieldTypeError('id', 'number');

    return { answerId };
  },
  format: gameFormatter.full,
}, async (req, res, { answerId }) => {
  const { game } = req.params;

  const propositions = await game.getPropositions();
  const answer = propositions.filter(p => p.id === answerId)[0];

  if (!answer)
    throw new BadRequestError('invalid answer id');

  await game.select(answer);

  return game;
});

router.post('/:id/next', {
  authorize: [
    req => isPlayer(req.player),
    req => isInGame(req.player, req.params.id),
    req => isGameState(req.params.game, 'started', 'end_of_turn'),
    req => isQuestionMaster(req.player),
  ],
  format: gameFormatter.full,
}, async (req, res, next) => {
  await req.params.game.nextTurn();
  return req.params.game;
});
