const expect = require('chai').expect;
const { QuestionFormatter, GameFormatter } = require('../src/formatters');

describe('formatter', () => {

  describe('question', () => {

    beforeEach(async function() {
      const { Game, Player, Question } = this.models;

      this.player = await new Player({ nick: 'nils' }).save();
      this.game = await new Game({ lang: 'fr', ownerId: this.player.id }).save();
      this.createQuestion = async data => await new Question({ ...data, gameId: this.game.id }).save();
    });

    it('should format a question', async function() {
      const question = await this.createQuestion({ lang: 'fr', text: 'coucou', blanks: null, available: true });
      const data = await QuestionFormatter.full(question);

      expect(data).to.have.property('id').that.is.a('number');
      expect(data).to.have.property('text', 'coucou');
      expect(data).to.have.property('blanks', null);
    });

    it('should format a question with blanks', async function() {
      const question = await this.createQuestion({ lang: 'fr', text: 'coucou', blanks: [1, 3], available: true });
      const data = await QuestionFormatter.full(question);

      expect(data).to.have.property('id').that.is.a('number');
      expect(data).to.have.property('text', 'coucou');
      expect(data).to.have.property('blanks').that.deep.eql([1, 3]);
    });

    it('should format many questions', async function() {
      const questions = [
        await this.createQuestion({ lang: 'fr', text: 'q1', blanks: null, available: true }),
        await this.createQuestion({ lang: 'fr', text: 'q2', blanks: [1, 3], available: true }),
      ];
      const data = await QuestionFormatter.full(questions, { many: true });

      expect(data).to.deep.eql([
        { id: questions[0].id, text: 'q1', blanks: null },
        { id: questions[1].id, text: 'q2', blanks: [1, 3] },
      ]);
    });

  });

  describe('game', () => {

    it('should format an idle game', async function() {
      const owner = await this.createPlayer();
      const game = await this.createGame({ owner });
      const data = await GameFormatter.full(game);

      expect(data).to.have.property('id').that.is.a('number');
      expect(data).to.have.property('state', 'idle');
      expect(data).to.have.property('owner', owner.nick);
      expect(data).to.have.property('players').that.is.a('array').of.length(1);
    });

    it('should format an idle game with players', async function() {
      const owner = await this.createPlayer();
      const game = await this.createReadyGame({ owner });
      const data = await GameFormatter.full(game);

      expect(data).to.have.property('id').that.is.a('number');
      expect(data).to.have.property('state', 'idle');
      expect(data).to.have.property('owner', owner.nick);
      expect(data).to.have.property('players').that.is.a('array').of.length(3);
    });

    it('should format an started game', async function() {
      const owner = await this.createPlayer();
      const game = await this.createStartedGame({ owner });
      const data = await GameFormatter.full(game);

      expect(data).to.have.property('id').that.is.a('number');
      expect(data).to.have.property('state', 'started');
      expect(data).to.have.property('owner', owner.nick);
      expect(data).to.have.property('players').that.is.an('array').of.length(3);
      expect(data).to.have.property('question').that.is.an('object');
    });

  });

});
