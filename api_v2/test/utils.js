async function createPlayer(opts = {}) {
  opts = {
    nick: 'nils',
    ...opts,
  };

  const { Player } = this.models;

  return await new Player(opts).save();
}

async function loginPlayer(player, app) {
  return await (app || this.app)
    .post('/api/player/login')
    .send({ nick: player.nick })
    .expect(200)
}

async function createLoginPlayer(opts, app) {
  const player = await this.createPlayer(opts);

  await this.loginPlayer(player, app);

  return player;
}

async function createGame(opts = {}) {
  opts = {
    lang: 'fr',
    ...opts,
  };

  if (!opts.owner)
    opts.owner = await this.createPlayer();

  const { Game } = this.models;
  const game = await new Game(opts).save();

  await game.addPlayer(opts.owner);
  await game.setOwner(opts.owner);

  return game;
}

module.exports = {
  createPlayer,
  loginPlayer,
  createLoginPlayer,
  createGame,
}