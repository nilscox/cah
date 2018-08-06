const Sequelize = require('sequelize');
const expect = require('chai').expect;

describe('game-controller', () => {

  it('should start a game', async function() {
    const game = await this.createReadyGame();

    await game.start({
      questions: 3,
    });

    const questions = await game.getQuestions({ where: { available: true } });
    const choices = await game.getChoices({ where: { available: true } });
    const questionMaster = await game.getQuestionMaster();

    expect(questions).to.be.an('array').of.length(2);
    expect(choices).to.be.an('array').of.length(3);
    expect(questionMaster).to.not.be.null;
    expect(game).to.have.property('state', 'started');

    for (let i = 0; i < game.players.length; ++i)
      expect(await game.players[i].countCards()).to.eql(2);
  });

  it('should answer a question', async function() {
    const game = await this.createStartedGame();
    const question = await game.getCurrentQuestion();
    const player = (await this.getPlayersWithoutQM(game))[0];
    const cards = await player.getCards({
      order: Sequelize.fn('RANDOM'),
      limit: question.getNbChoices(),
    });

    await game.answer(player, cards);

    const answers = await game.getAnswers();

    expect(answers).to.be.an('array').of.length(1);

    const choices = await answers[0].getChoices();

    expect(choices).to.be.an('array').of.length(question.getNbChoices());
    for (let choice of choices)
      expect(choice).to.have.property('available', false);

    expect(await player.countCards()).to.eql(2 - question.getNbChoices());
  });

});
