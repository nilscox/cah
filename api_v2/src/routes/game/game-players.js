const router = require('./router');
const { BadRequestError } = require('../../errors');
const { GameFormatter } = require('../../formatters')

router.post('/:id/join', async (req, res, next) => {
  try {
    await req.game.join(req.player);

    res.json(await GameFormatter.full(req.game));
  } catch (e) {
    next(e);
  }
});

router.post('/:id/leave', async (req, res, next) => {
  try {
    await req.game.leave(req.player);

    res.status(204).end();
  } catch (e) {
    next(e);
  }
});
