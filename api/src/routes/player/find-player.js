const { NotFoundError } = require('../../errors');
const { Player } = require('../../models');

module.exports = async (req, res, next, nick) => {
  try {
    const player = await Player.findOne({
      where: { nick },
      include: ['game'],
    });

    if (!player)
      throw new NotFoundError('player');

    req.params.player = player;
    next();
  } catch (e) {
    next(e);
  }
};
