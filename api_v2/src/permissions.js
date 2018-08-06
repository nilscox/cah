const { AuthenticationError } = require('./errors');

const allow = () => {};

const isPlayer = async req => {
  if (!req.player)
    throw new AuthenticationError('you must a player');
};

const isNotPlayer = async req => {
  if (req.player)
    throw new AuthenticationError('you must not be a player');
};

const isMe = async req => {
  await isPlayer(req);

  if (req.player.nick !== req.params.nick)
    throw new AuthenticationError('you must be ' + req.params.nick);
};

const isInGame = async req => {
  const game = await req.player.getGame();

  if (!game)
    throw new AuthenticationError('you must be in game');
};

const isNotInGame = async req => {
  const game = await req.player.getGame();

  if (game)
    throw new AuthenticationError('you must not be in game');
};

const isGameOwner = async req => {
  const game = req.player.getGame({ include: 'owner' });

  if (game.owner.nick !== req.player.nick)
    throw new AuthenticationError('you must be the game owner');
};

module.exports = {
  allow,
  isPlayer,
  isNotPlayer,
  isMe,
  isInGame,
  isNotInGame,
  isGameOwner,
};
