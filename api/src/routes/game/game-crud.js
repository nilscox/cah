const { Game } = require('../../models');
const { gameValidator } = require('../../validators');
const { gameFormatter } = require('../../formatters');
const {
  isPlayer,
  isAdmin,
  isNotInGame,
  isInGame,
  isGameOwner,
  isGameState
} = require('../../permissions');
const websockets = require('../../websockets');
const { info } = require('../../utils');
const findGame = require('./find-game');

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
  after: async (req, game) => {
    websockets.admin('GAME_CREATE', { game: await gameFormatter.admin(game) });
    info('GAME', 'create', '#' + game.id);
  },
}, async (req, res, data) => {
  if (!data.ownerId)
    data.ownerId = req.player.id;

  const game = await Game.create(data);

  await game.join(req.player);

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
  after: async (req, game) => {
    websockets.admin('GAME_UPDATE', { game: await gameFormatter.admin(game) });
    info('GAME', 'update', '#' + game.id);
  },
}, async (req, res, data) => {
  await req.params.game.update(data);

  return req.params.game;
});

router.delete('/:id', {
  authorize: [
    req => isPlayer(req.player),
    req => isGameOwner(req.player, req.params.game),
    req => isGameState(req.params.game, 'idle'),
  ],
  after: async (req, game) => {
    websockets.admin('GAME_DELETE', { game: await gameFormatter.admin(game) });
    info('GAME', 'delete', '#' + game.id);
  },
}, async req => { await req.params.game.destroy() });