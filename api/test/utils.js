const Sequelize = require('sequelize');

const Op = Sequelize.Op;

async function createPlayer(opts = {}) {
  opts.nick = opts.nick || 'nils';

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
  opts.lang = opts.lang || 'fr';
  opts.owner = opts.owner || await this.createPlayer();
  opts.ownerId = opts.owner.id;
  opts.nbQuestions = opts.nbQuestions || 2;
  opts.cardsPerPlayer = opts.cardsPerPlayer || 4;

  const { Game } = this.models;
  const game = await new Game(opts).save();

  await this.ctrl.join(game, opts.owner);

  return game;
}

async function createReadyGame(opts = {}, nicks = ['toto', 'tata']) {
  const game = await this.createGame(opts);

  for (let i = 0; i < nicks.length; ++i)
    await this.ctrl.join(game, await this.createPlayer({ nick: nicks[i] }));

  return game;
}

async function createStartedGame(opts, nicks) {
  const game = await this.createReadyGame(opts, nicks);

  await this.ctrl.start(game);

  return game;
}

async function createRunningGame(opts, nicks, turns = 1) {
  const game = await this.createStartedGame(opts, nicks);

  for (let i = 0; i < turns; ++i)
    await this.playRandomTurn(game);

  return game;
}

async function getPlayersWithoutQM(game) {
  return await game.getPlayers({
    where: {
      id: { [Op.not]: game.questionMasterId },
    },
  });
}

async function answerRandomCards(game, player) {
  const question = await game.getCurrentQuestion();
  const nbChoices = question.getNbChoices()
  const cards = await player.getCards({
    order: Sequelize.fn('RANDOM'),
    limit: nbChoices,
  });

  if (!cards || cards.length < nbChoices)
    throw new Error('player has not enough cards');

  await this.ctrl.answer(game, player, cards);
}

async function selectRandomAnswer(game) {
  const propositions = await game.getPropositions();

  await this.ctrl.select(game, propositions[~~(Math.random() * propositions.length)]);
}

async function playRandomTurn(game) {
  const players = await this.getPlayersWithoutQM(game);

  for (let j = 0; j < players.length; ++j)
    await this.answerRandomCards(game, players[j]);

  await this.selectRandomAnswer(game);
  await this.ctrl.nextTurn(game);
}

module.exports = {
  createPlayer,
  loginPlayer,
  createLoginPlayer,
  createGame,
  createReadyGame,
  createStartedGame,
  createRunningGame,
  getPlayersWithoutQM,
  answerRandomCards,
  selectRandomAnswer,
  playRandomTurn,
};
