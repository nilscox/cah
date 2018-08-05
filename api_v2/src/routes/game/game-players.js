const router = require('./router');
const { BadRequestError } = require('../../errors');
const { GameFormatter } = require('../../formatters')

router.post('/:id/join', (req, res, next) => {
  req.game.join(req.player)
    .then(game => game.reload({ include: ['owner', 'players'] }))
    .then(game => res.format(GameFormatter, game))
    .catch(next);
});

router.post('/:id/leave', (req, res, next) => {
  req.game.leave(req.player)
    .then(() => res.status(204).end())
    .catch(next);
});
