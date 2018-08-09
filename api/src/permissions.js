const { AuthenticationError } = require('./errors');

const allow = () => {};

const isPlayer = async (player, nick) => {
  if (!player)
    throw new AuthenticationError('you must a player');

  if (nick && player.nick !== nick)
    throw new AuthenticationError('you must be ' + nick);
};

const isNotPlayer = async player => {
  if (player)
    throw new AuthenticationError('you must not be a player');
};

const isAdmin = async admin => {
  if (!admin)
    throw new AuthenticationError('you must be an admin');
};

const isInGame = async (player, gameId) => {
  const game = await player.getGame();

  if (!game)
    throw new AuthenticationError('player must be in game');

  // gameId may be a string
  if (gameId && game.id != gameId)
    throw new AuthenticationError('player must be in the game with id ' + gameId);
};

const isNotInGame = async player => {
  const game = await player.getGame();

  if (game)
    throw new AuthenticationError('player must not be in game');
};

const isGameOwner = async (player, game) => {
  if (game.ownerId !== player.id)
    throw new AuthenticationError('player must be the game owner');
};

const isQuestionMaster = async (player) => {
  const game = await player.getGame();

  if (game.questionMasterId !== player.id)
    throw new AuthenticationError('player must be the question master');
};

const isNotQuestionMaster = async (player) => {
  const game = await player.getGame();

  if (game.questionMasterId === player.id)
    throw new AuthenticationError('player must not be the question master');
};

const isGameState = async (game, state, playState) => {
  if (game.state !== state)
    throw new AuthenticationError('game is not ' + state);

  if (playState && await game.getPlayState() !== playState)
    throw new AuthenticationError('game is not in playState ' + playState);
};

module.exports = {
  allow,
  isPlayer,
  isNotPlayer,
  isAdmin,
  isInGame,
  isNotInGame,
  isGameOwner,
  isQuestionMaster,
  isNotQuestionMaster,
  isGameState,
};
