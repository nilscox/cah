const { Game } = require('../../models');
const { GameValidator } = require('../../validators');
const { GameFormatter } = require('../../formatters');
const { isPlayer, isNotInGame, isInGame, isGameOwner } = require('../../permissions');
const findGame = require('./find-game');

const router = require('../createRouter')();
module.exports = router.router;

router.param('id', findGame);

router.get('/', {
  authorize: req => isPlayer(req.player),
  formatter: GameFormatter.full,
}, async () => {
  return await Game.findAll({
    include: 'owner',
  });
});

router.get('/:id', {
  authorize: req => isPlayer(req.player),
  formatter: GameFormatter.full,
}, req => req.params.game);

router.post('/', {
  authorize: [
    req => isPlayer(req.player),
    req => isNotInGame(req.player),
  ],
  validator: req => GameValidator.validate(req.body),
  formatter: GameFormatter.full,
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
  validator: req => GameValidator.validate(req.body, { partial: true, lang: { readOnly: true } }),
  formatter: GameFormatter.full,
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
