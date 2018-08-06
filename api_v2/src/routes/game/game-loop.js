const { InvalidFieldTypeError, BadRequestError, MissingFieldError } = require('../../errors');
const { Sequelize, Game } = require('../../models');
const { GameValidator } = require('../../validators');
const { GameFormatter } = require('../../formatters');
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
      if (req.game.state !== 'idle')
        throw new BadRequestError('game has already started');
    },
  ],
  validator: (data) => {
    const { questions } = data;

    if (questions && typeof questions !== 'number')
      throw new InvalidFieldTypeError('questions', 'number');
  },
  formatter: GameFormatter.full,
}, async (req, res, data) => {
  await req.game.start(data.questions);
  return req.game;
});

router.post('/:id/answer', {
  authorize: [
    req => isPlayer(req.player),
    req => isInGame(req.player, req.params.id),
    req => isGameState(req.game, 'started', 'players_answer'),
    req => isNotQuestionMaster(req.player),
  ],
  validator: req => {
    const ids = req.body.ids || req.body.id && [req.body.id];

    if (!ids)
      throw new MissingFieldError('id | ids');

    if (!(ids instanceof Array) || ids.map(id => typeof id !== 'number').indexOf(true) >= 0)
      throw new InvalidFieldTypeError('id | ids', 'number | number[]');

    return { ids };
  },
  formatter: GameFormatter.full,
}, async (req, res, data) => {
  const { game } = req;

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

  return game;
});

router.post('/:id/select', {
  authorize: [
    req => isPlayer(req.player),
    req => isInGame(req.player, req.params.id),
    req => isGameState(req.game, 'started', 'question_master_selection'),
    req => isQuestionMaster(req.player),
  ],
  validator: req => {
    const answerId = req.body.id;

    if (!answerId)
      throw new MissingFieldError('id');

    if (typeof answerId !== 'number')
      throw new InvalidFieldTypeError('id', 'number');
  },
  formatter: GameFormatter.full,
}, async (req, res, next) => {
  const { game } = req;

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
    req => isInGame(req.player, req.params.game),
    req => isGameState(req.game, 'started', 'end_of_turn'),
    req => isQuestionMaster(req.player),
  ],
}, async (req, res, next) => {
  await req.game.nextTurn();
  return req.game;
});
