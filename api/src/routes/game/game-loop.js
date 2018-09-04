const { InvalidFieldTypeError, BadRequestError, MissingFieldError } = require('../../errors');
const { Sequelize } = require('../../models');
const { gameFormatter } = require('../../formatters');
const {
  isPlayer,
  isGameOwner,
  isInGame,
  isGameState,
  isQuestionMaster,
  isNotQuestionMaster,
  didNotAnswer,
} = require('../../permissions');
const events = require('../../events');
const gameController = require('../../game');
const findGame = require('./find-game');

const router = require('../createRouter')();
module.exports = router.router;

const Op = Sequelize.Op;

const format = opts => (req, value) => {
  if (req.admin)
    return gameFormatter.admin(value, opts);

  return gameFormatter.full(value, opts);
};

router.param('id', findGame);

router.post('/:id/start', {
  authorize: [
    req => isPlayer(req.player),
    req => isGameOwner(req.player, req.params.game),
    req => isGameState(req.params.game, 'idle'),
  ],
  format: format(),
  after: (req, game) => events.emit('game start', game),
}, async (req, res, { game }) => {
  await gameController.start(game);
  return game;
});

router.post('/:id/answer', {
  authorize: [
    req => isPlayer(req.player),
    req => isInGame(req.player, req.params.id),
    req => isGameState(req.params.game, 'started', 'players_answer'),
    req => isNotQuestionMaster(req.player),
    req => didNotAnswer(req.params.game, req.player),
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
  format: format(),
  after: (req, game) => events.emit('game answer', game, req.player, req.validated),
}, async ({ validated, player }, res, { game }) => {
  const { ids } = validated;

  const choices = await player.getCards({
    where: {
      id: { [Op.in]: ids },
    },
  });

  if (ids.length !== choices.length)
    throw new BadRequestError('invalid id | ids');

  const question = await game.getCurrentQuestion();

  if (choices.length !== question.getNbChoices())
    throw new BadRequestError('invalid number of choices');

  await gameController.answer(game, player, choices);

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
  format: format(),
  after: (req, game) => events.emit('game select', game, req.player, req.validated),
}, async ({ validated, player }, res, { game }) => {
  const { answerId } = validated;

  const propositions = await game.getPropositions();
  const answer = propositions.filter(p => p.id === answerId)[0];

  if (!answer)
    throw new BadRequestError('invalid answer id');

  await gameController.select(game, player, answer);

  return game;
});

router.post('/:id/next', {
  authorize: [
    req => isPlayer(req.player),
    req => isInGame(req.player, req.params.id),
    req => isGameState(req.params.game, 'started', 'end_of_turn'),
    req => isQuestionMaster(req.player),
  ],
  format: format(),
  after: (req, game) => events.emit('game next', game),
}, async (req, res, { game }) => {
  await gameController.nextTurn(game);
  return game;
});
