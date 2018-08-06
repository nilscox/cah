const { Game } = require('../../models');
const { GameValidator } = require('../../validators');
const { GameFormatter } = require('../../formatters');
const { isPlayer, isNotInGame, isInGame, isGameOwner } = require('../../permissions');
const findGame = require('./find-game');

const router = require('../createRouter')();
module.exports = router.router;

router.param('id', findGame);

router.get('/', {
  authorize: isPlayer,
  formatter: GameFormatter.full,
}, async () => {
  return await Game.findAll({
    include: 'owner',
  });
});

router.get('/:id', {
  authorize: isPlayer,
  formatter: GameFormatter.full,
}, req => req.params.game);

router.post('/', {
  authorize: [isPlayer, isNotInGame],
  validator: req => GameValidator.validate(req.body),
  formatter: GameFormatter.full,
}, async (req, res, data) => {
  const game = await Game.create({ ...data, ownerId: req.player.id });

  await game.join(req.player);

  return game;
});

router.put('/:id', {
  authorize: [isPlayer, isGameOwner],
  validator: req => GameValidator.validate(req.body, { partial: true, lang: { readOnly: true } }),
  formatter: GameFormatter.full,
}, async (req, res, data) => {
  await req.params.game.update(game);

  return game;
});

router.delete('/:id', {
  authorize: [isPlayer, isGameOwner],
}, async req => await req.params.game.destroy());
