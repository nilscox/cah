const { Game } = require('../../models');
const { gameValidator } = require('../../validators');
const { gameFormatter } = require('../../formatters');
const { isPlayer, isAdmin, isNotInGame, isInGame, isGameOwner } = require('../../permissions');
const findGame = require('./find-game');

const router = require('../createRouter')();
module.exports = router.router;

router.param('id', findGame);

router.get('/', {
  authorize: {
    or: [
      req => isAdmin(req.admin),
      req => isPlayer(req.player),
    ],
  },
  format: games => gameFormatter.full(games, { many: true }),
}, async () => {
  return await Game.findAll({
    include: 'owner',
  });
});

router.get('/:id', {
  authorize: {
    or: [
      req => isAdmin(req.admin),
      req => isPlayer(req.player),
    ],
  },
  format: gameFormatter.full,
}, req => req.params.game);

router.post('/', {
  authorize: [{
    or: [
      req => isAdmin(req.admin),
      [
        req => isPlayer(req.player),
        req => isNotInGame(req.player),
      ],
    ],
  }],
  validate: req => gameValidator.validate(req.body, {
    ownerId: { required: !!req.admin, readOnly: !req.admin },
    state: { readOnly: true },
  }),
  format: gameFormatter.full,
}, async (req, res, data) => {
  if (!data.ownerId)
    data.ownerId = req.player.id;

  const game = await Game.create(data);

  await game.join(req.player);

  res.status(201);
  return game;
});

router.put('/:id', {
  authorize: [{
    or: [
      req => isAdmin(req.admin),
      [
        req => isPlayer(req.player),
        req => isGameOwner(req.player),
      ],
    ],
  }],
  validate: req => {
    const { game } = req.params;
    const isStarted = game.state === 'started';

    return gameValidator.validate(req, {
      partial: true,
      ownerId: { readOnly: true },
      state: { readOnly: true },
      lang: { readOnly: !isStarted },
      nbQuestions: { readOnly: !isStarted },
      cardsPerPlayer: { readOnly: !isStarted },
    });
  },
  format: gameFormatter.full,
}, async (req, res, data) => {
  await req.params.game.update(data);

  return req.params.game;
});

router.delete('/:id', {
  authorize: [{
    or: [
      req => isAdmin(req.admin),
      [
        req => isPlayer(req.player),
        req => isGameOwner(req.player),
      ],
    ],
  }],
}, async req => { await req.params.game.destroy() });
