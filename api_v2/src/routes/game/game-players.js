const router = require('./router');
const { BadRequestError } = require('../../errors');

router.post('/:id/join', (req, res, next) => {
  req.game.addPlayer(req.player)
    .then(game => game.reload({ include: ['owner', 'players'] }))
    .then(game => res.json(game))
    .catch(next);
});

router.post('/:id/leave', (req, res, next) => {
  req.game.removePlayer(req.player)
    .then(() => res.status(204).end())
    .catch(next);
});
