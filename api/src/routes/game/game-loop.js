const { InvalidFieldTypeError, BadRequestError, MissingFieldError } = require('../../errors');
const { Sequelize, Game } = require('../../models');
const { gameValidator } = require('../../validators');
const { gameFormatter } = require('../../formatters');
const { isPlayer, isGameOwner, isInGame, isGameState, isQuestionMaster, isNotQuestionMaster } = require('../../permissions');
const websockets = require('../../websockets');
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
  after: async (req, game) => {
    websockets.admin('GAME_START', { game: await gameFormatter.admin(game) });
    info('GAME', 'start', '#' + game.id);
  },
}, async (req, res) => {
  const { game } = req.params;

  await game.start();

  return game;
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
  format: format(),
  after: async (req, game) => {
    websockets.admin('GAME_ANSWER', { game: await gameFormatter.admin(game) });
    info('GAME', 'answer', '#' + game.id);
  },
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
  format: format(),
  after: async (req, game) => {
    websockets.admin('GAME_SELECT', { game: await gameFormatter.admin(game) });
    info('GAME', 'select', '#' + game.id);
  },
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
  format: format(),
  after: async (req, game) => {
    if (game.state === 'started') {
      websockets.admin('GAME_NEXT', { game: await gameFormatter.admin(game) });
      info('GAME', 'next', '#' + game.id);
    } else {
      websockets.admin('GAME_END', { game: await gameFormatter.admin(game) });
      info('GAME', 'end', '#' + game.id);
    }
  },
}, async (req, res, next) => {
  const { game } = req.params;

  await game.nextTurn();

  return game;
});
