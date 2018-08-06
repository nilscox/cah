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

  it.skip('should answer a question', async function() {
    const game = await this.createStartedGame();
    const players = await this.models.Player.findAll();
    const qm = game.questionMaster;
    const player = await (qm.equals(players[0]) ? players[1] : players[0]).reload({ include: ['cards'] });
    const choices = player.cards;

    await game.answer(player, []);
  });

});
