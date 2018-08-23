const expect = require('chai').expect;
const ctrl = require('../../src/game');

describe('controller', () => {

  beforeEach(function() {
    return this.setupDatabase();
  });

  describe('game', () => {

    it('should start a game', async function() {
      const game = await this.createReadyGame();

      await ctrl.start(game);
      await game.reload({
        include: [
          { association: 'players', include: 'cards' },
          'questions',
          'choices',
          'questionMaster',
          'currentQuestion',
          'answers',
          'selectedAnswer',
          'turns',
        ],
      });

      expect(game.questionMaster).to.not.be.null;
      expect(game.currentQuestion).to.not.be.null;
      expect(game.answers).to.be.an('array').that.is.empty;
      expect(game.selectedAnswer).to.be.null;
      expect(game.turns).to.be.an('array').that.is.empty;

      expect(game.state).to.eql('started');

      const p = game.players.length;
      const b = game.questions.reduce((sum, q) => sum + q.getNbChoices(), 0);
      const n = game.cardsPerPlayer;

      expect(game.questions.length).to.eql(2);
      expect(await game.countQuestions({ where: { available: true } })).to.eql(1);
      expect(game.choices.length).to.eql(b * (p - 1) + n * p);
      expect(await game.countChoices({ where: { available: true } })).to.eql(b * (p - 1));

      for (let i = 0; i < game.players.length; ++i)
        expect(game.players[i].cards.length).to.eql(4);
    });

    it('should answer a question', async function() {
      const game = await this.createStartedGame();
      const players = await this.getPlayersWithoutQM(game);
      const question = await game.getCurrentQuestion();

      await this.answerRandomCards(game, players[0]);

      expect(await game.getPlayState()).to.eql('players_answer');
      expect(await players[0].countCards()).to.eql(game.cardsPerPlayer - question.getNbChoices());
      expect(await game.countAnswers()).to.eql(1);

      await this.answerRandomCards(game, players[1]);

      expect(await game.getPlayState()).to.eql('question_master_selection');
      expect(await players[1].countCards()).to.eql(game.cardsPerPlayer - question.getNbChoices());
      expect(await game.countAnswers()).to.eql(2);

      await game.reload({ include: ['questionMaster'] });
      expect(await game.questionMaster.countCards()).to.eql(game.cardsPerPlayer);

      const propositions = game.getPropositions();

      for (let i = 0; i < propositions.length; ++i)
        expect(await propositions[i]).to.have.property('place').that.is.not.null;
    });

    it('should select an answer', async function() {
      const game = await this.createStartedGame();
      const players = await this.getPlayersWithoutQM(game);

      for (let i = 0; i < players.length; ++i)
        await this.answerRandomCards(game, players[i]);

      const propositions = await game.getPropositions();

      await ctrl.select(game, propositions[~~(Math.random() * propositions.length)]);

      expect(await game.getPlayState()).to.eql('end_of_turn');
    });

  });

});
