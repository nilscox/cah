const { gameFormatter } = require('../../formatters');
const {
  isPlayer,
  isInGame,
  isNotInGame,
  isGameState,
  isNotQuestionMaster,
  isNotGameState,
} = require('../../permissions');
const gameController = require('../../game');
const findGame = require('./find-game');

const router = require('../createRouter')();
module.exports = router.router;

const format = opts => (req, value) => {
  if (req.admin)
    return gameFormatter.admin(value, opts);

  return gameFormatter.full(value, opts);
};

router.param('id', findGame);

router.post('/:id/join', {
  authorize: [
    req => isPlayer(req.player),
    req => isNotInGame(req.player),
    req => isGameState(req.params.game, 'idle'),
  ],
  format: format(),
}, async ({ player }, res, { game }) => {
  await gameController.join(game, player);
  return game;
});

router.post('/:id/leave', {
  authorize: [
    req => isPlayer(req.player),
    req => isInGame(req.player, req.params.id),
    { or: [
      req => isNotGameState(req.params.game, 'started'),
      { and: [
        req => isGameState(req.params.game, 'started', 'end_of_turn'),
        req => isNotQuestionMaster(req.player),
      ] },
    ] },
  ],
}, async ({ player }, res, { game }) => {
  await gameController.leave(game, player);
});
