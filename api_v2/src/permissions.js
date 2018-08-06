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

const isInGame = async (player, gameId) => {
  const game = await player.getGame();

  if (!game)
    throw new AuthenticationError('you must be in game');

  // gameId may be a string
  if (gameId && game.id != gameId)
    throw new AuthenticationError('you must be in the game with id ' + gameId);
};

const isNotInGame = async player => {
  const game = await player.getGame();

  if (game)
    throw new AuthenticationError('you must not be in game');
};

const isGameState = async (game, state, playState) => {
  if (game.state !== starte)
    throw new BadRequestError('game is not ' + state);

  if (playState && await game.getPlayState() !== playState)
    throw new BadRequestError('game is not in playState ' + playState);
};

const isGameOwner = async (player, gameId) => {
  await isInGame(player, gameId);

  const game = await player.getGame();

  if (game.ownerId !== player.id)
    throw new AuthenticationError('you must be the game owner');
};

const isQuestionMaster = async (player) => {
  const game = await player.getGame();

  if (game.questionMasterId !== player.id)
    throw new BadRequestError('you must be the question master');
};

const isNotQuestionMaster = async (player) => {
  const game = await player.getGame();

  if (game.questionMasterId === player.id)
    throw new BadRequestError('you must not be the question master');
};

module.exports = {
  allow,
  isPlayer,
  isNotPlayer,
  isInGame,
  isNotInGame,
  isGameOwner,
};
