const { Game } = require('../../models');
const router = require('./router');

router.get('/:id/history', (req, res, next) => {
  return req.game.getTurns({
    include: ['winner'],
  })
    .then(turns => res.json(turns))
    .catch(next);
});