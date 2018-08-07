const { NotFoundError } = require('../../errors');
const { Game } = require('../../models');

module.exports = async (req, res, next, id) => {
  try {
    const game = await Game.findOne({
      where: { id },
      include: ['owner', {
        association: 'players',
        include: ['cards'],
      }],
    });

    if (!game)
      throw new NotFoundError('game');

    req.params.game = game;
    next();
  } catch (e) {
    next(e);
  }
};
