const router = require('./router');
const { isPlayer } = require('../../auth');
const { BadRequestError } = require('../../errors');

router.post('/:id/join', isPlayer, (req, res, next) => {
  req.player.getGame()
    .then(game => {
      if (game)
        throw new BadRequestError('player is already in game');

      return req.game.addPlayer(req.player);
    })
    .then(game => res.json(game))
    .catch(next);
});

router.post('/:id/leave', isPlayer, (req, res, next) => {
  if (!player.game)
    return next(new BadRequestError('player is not in game'));

  req.game.players.add(req.player);
});
