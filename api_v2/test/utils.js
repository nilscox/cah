const createPlayer = async ({ Player }, opts = {}) => {
  const nick = opts.nick || 'nils';

  return await new Player({ nick }).save();
};

const createGame = async ({ Player, Game }, opts = {}) => {
  const lang = opts.lang || 'fr';
  const owner = opts.owner || await createPlayer({ Player });

  const game = await new Game({ lang }).save();

  await game.setOwner(owner);

  return game;
};

module.exports = {
  createPlayer,
  createGame,
};
