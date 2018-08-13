const { BadRequestError } = require('../../errors');
const { gameFormatter } = require('../../formatters');
const { isPlayer, isInGame, isNotInGame } = require('../../permissions');
const websockets = require('../../websockets');
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
  ],
  format: format(),
  after: async (req, game) => {
    websockets.admin('GAME_JOIN', { game: await gameFormatter.admin(game) });
    info('GAME', 'join', '#' + game.id, '(' + req.params.player.nick + ')');
  },
}, async (req, res, next) => {
  await req.params.game.join(req.player);
  return req.params.game;
});

router.post('/:id/leave', {
  authorize: [
    req => isPlayer(req.player),
    req => isInGame(req.player, req.params.id),
  ],
  after: async (req, game) => {
    websockets.admin('GAME_LEAVE', { game: await gameFormatter.admin(game) });
    info('GAME', 'leave', '#' + game.id, '(' + req.params.player.nick + ')');
  },
}, async req => {
  await req.params.game.leave(req.player);
});
