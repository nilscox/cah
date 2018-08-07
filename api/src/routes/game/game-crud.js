const { Game } = require('../../models');
const { gameValidator } = require('../../validators');
const { gameFormatter } = require('../../formatters');
const { isPlayer, isNotInGame, isInGame, isGameOwner } = require('../../permissions');
const findGame = require('./find-game');

const router = require('../createRouter')();
module.exports = router.router;

router.param('id', findGame);

router.get('/', {
  authorize: req => isPlayer(req.player),
  format: games => gameFormatter.full(games, { many: true }),
}, async () => {
  return await Game.findAll({
    include: 'owner',
  });
});

router.get('/:id', {
  authorize: req => isPlayer(req.player),
  format: gameFormatter.full,
}, req => req.params.game);

router.post('/', {
  authorize: [
    req => isPlayer(req.player),
    req => isNotInGame(req.player),
  ],
  validate: gameValidator.body(),
  format: gameFormatter.full,
}, async (req, res, data) => {
  const game = await Game.create({ ...data, ownerId: req.player.id });

  await game.join(req.player);

  res.status(201);
  return game;
});

router.put('/:id', {
  authorize: [
    req => isPlayer(req.player),
    req => isGameOwner(req.player),
  ],
  validate: gameValidator.body({ partial: true, lang: { readOnly: true } }),
  format: gameFormatter.full,
}, async (req, res, data) => {
  await req.params.game.update(data);

  return req.params.game;
});

router.delete('/:id', {
  authorize: [
    req => isPlayer(req.player),
    req => isGameOwner(req.player),
  ],
}, async req => { await req.params.game.destroy() });
