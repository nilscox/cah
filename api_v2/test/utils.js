const Sequelize = require('sequelize');
const Op = Sequelize.Op;

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
    .expect(200);
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

  opts.ownerId = opts.owner.id;

  const { Game } = this.models;
  const game = await new Game(opts).save();

  await game.addPlayer(opts.owner);

  return game;
}

async function joinGame(game, player) {
  if (player instanceof Array)
    return await Promise.all(player.map(async p => await game.appPlayer(p)));

  return await game.join(player);
}

async function createReadyGame(opts = {}, nicks = ['toto', 'tata']) {
  if (!opts.owner)
    opts.owner = await this.createLoginPlayer();

  const game = await this.createGame(opts);

  for (let i = 0; i < nicks.length; ++i)
    await game.addPlayer(await this.createPlayer({ nick: nicks[i] }));

  return game.reload({ include: ['owner', 'players'] });
}

async function createStartedGame(opts, nicks) {
  const game = await this.createReadyGame(opts, nicks);

  await game.start();

  return game.reload({ include: ['questionMaster'] });
}

async function getPlayersWithoutQM(game) {
  return await this.models.Player.findAll({
    where: {
      id: { [Op.not]: game.questionMasterId },
    },
  });
}

async function answerRandomCard(game, player) {
  const question = await game.getCurrentQuestion();
  const cards = await player.getCards({
    order: Sequelize.fn('RANDOM'),
    limit: question.getNbChoices(),
  });

  if (!cards)
    throw new Error('player has no cards');

  await game.answer(player, cards);
}

module.exports = {
  createPlayer,
  loginPlayer,
  createLoginPlayer,
  createGame,
  joinGame,
  createReadyGame,
  createStartedGame,
  getPlayersWithoutQM,
  answerRandomCard,
}