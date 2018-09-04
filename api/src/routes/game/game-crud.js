const { Sequelize, Game } = require('../../models');
const { gameValidator } = require('../../validators');
const { gameFormatter } = require('../../formatters');
const {
  isPlayer,
  isAdmin,
  isNotInGame,
  isGameOwner,
  isGameState
} = require('../../permissions');
const events = require('../../events');
const gameController = require('../../game');
const findGame = require('./find-game');

const Op = Sequelize.Op;

const router = require('../createRouter')();
module.exports = router.router;

const format = opts => (req, value) => {
  if (req.admin)
    return gameFormatter.admin(value, opts);

  return gameFormatter.full(value, opts);
};

router.param('id', findGame);

router.get('/', {
  authorize: { or: [
    req => isAdmin(req.admin),
    req => isPlayer(req.player),
  ] },
  format: format({ many: true }),
}, async () => {
  return await Game.findAll({
    where: {
      state: {
        [Op.not]: 'finished',
      },
    },
    include: 'owner',
  });
});

router.get('/:id', {
  authorize: { or: [
    req => isAdmin(req.admin),
    req => isPlayer(req.player),
  ] },
  format: format(),
}, req => req.params.game);

router.post('/', {
  authorize: [
    req => isPlayer(req.player),
    req => isNotInGame(req.player),
  ],
  validate: gameValidator.body({
    state: { readOnly: true },
  }),
  format: format(),
}, async ({ validated, player }, res) => {
  if (!validated.ownerId)
    validated.ownerId = player.id;

  const game = await Game.create(validated);
  events.emit('game:create', game, validated);

  await gameController.join(game, player);

  res.status(201);
  return game;
});

router.put('/:id', {
  authorize: [
    req => isPlayer(req.player),
    req => isGameOwner(req.player, req.params.game),
  ],
  validate: req => {
    const { game } = req.params;
    const isStarted = game.state === 'started';

    return gameValidator.validate(req.body, {
      partial: true,
      ownerId: { readOnly: true },
      state: { readOnly: true },
      lang: { readOnly: isStarted },
      nbQuestions: { readOnly: isStarted },
      cardsPerPlayer: { readOnly: isStarted },
    });
  },
  format: format(),
}, async ({ validated }, res, { game }) => {
  await game.update(validated);
  events.emit('game:update', game, validated);

  return game;
});

router.delete('/:id', {
  authorize: [
    req => isPlayer(req.player),
    req => isGameOwner(req.player, req.params.game),
    req => isGameState(req.params.game, 'idle'),
  ],
}, async (req, res, { game }) => {
  await game.destroy();
  events.emit('game:delete', game);
});
