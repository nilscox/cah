const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = (sequelize, DataTypes) => {

  const Game = sequelize.define('Game', {
    lang: DataTypes.STRING,
    state: DataTypes.STRING,
    nbQuestions: DataTypes.INTEGER,
    cardsPerPlayer: DataTypes.INTEGER,
  }, {
    tableName: 'game',
  });

  Game.associate = function({ Question, Choice, Player, Answer, GameTurn }) {
    Game.belongsTo(Player, { as: 'owner', foreignKey: 'ownerId' });
    Game.belongsTo(Player, { as: 'questionMaster', foreignKey: 'questionMasterId' });
    Game.hasMany(Player, { as: 'players', foreignKey: 'gameId' });
    Game.hasMany(GameTurn, { as: 'turns', foreignKey: 'gameId' });
    Game.hasMany(Question, { as: 'questions', foreignKey: 'gameId' });
    Game.hasMany(Choice, { as: 'choices', foreignKey: 'gameId' });
    Game.belongsTo(Question, { as: 'currentQuestion', foreignKey: 'questionId' });
    Game.hasMany(Answer, { as: 'answers', foreignKey: 'gameId' });
    Game.belongsTo(Answer, { as: 'selectedAnswer', foreignKey: 'selectedAnswerId' });

    Game.defaultScope = {
      include: ['players', 'owner'],
    };
  };

  Game.prototype.getPlayState = async function() {
    if (this.state !== 'started')
      return null;

    if (this.selectedAnswerId)
      return 'end_of_turn';

    const propositions = await this.getPropositions();
    const playersCount = await this.countPlayers();

    if (propositions.length === playersCount - 1)
      return 'question_master_selection';

    return 'players_answer';
  };

  Game.prototype.createQuestions = async function(n) {
    const MasterQuestion = sequelize.model('masterquestion');
    const Question = sequelize.model('question');

    const mquestions = await MasterQuestion.findAll({
      where: { lang: this.lang },
      order: Sequelize.fn('RANDOM'),
      limit: n,
    });

    if (mquestions.length < n)
      throw new Error('not enough questions');

    return await Question.bulkCreate(mquestions.map(mq => {
      const values = mq.get();

      values.available = true;
      values.gameId = this.id;
      delete values.id;

      return values;
    }));
  };

  Game.prototype.createChoices = async function(n) {
    const MasterChoice = sequelize.model('masterchoice');
    const Choice = sequelize.model('choice');

    const mchoices = await MasterChoice.findAll({
      where: { lang: this.lang },
      order: Sequelize.fn('RANDOM'),
      limit: n,
    });

    if (mchoices.length < n)
      throw new Error('not enough choices');

    return await Choice.bulkCreate(mchoices.map(mc => {
      const values = mc.get();

      values.available = true;
      values.gameId = this.id;
      delete values.id;

      return values;
    }));
  };

  /**
   * Create the questions and choices from master data
   */
  Game.prototype.createCards = async function() {
    const questions = await this.createQuestions(this.nbQuestions);

    const p = await this.countPlayers();
    const b = questions.reduce((sum, q) => sum + q.getNbChoices(), 0);
    const n = this.cardsPerPlayer;
    const nbChoices = b * (p - 1) + n * p;

    await this.createChoices(nbChoices);
    // console.log('nbChoices: ' + nbChoices);
  };

  Game.prototype.getPropositions = async function(where = {}) {
    if (!this.questionId)
      return;

    return await this.getAnswers({
      where: {
        ...where,
        questionId: { [Op.eq]: this.questionId },
      },
      orderBy: ['place', 'id'],
      include: ['choices'],
    });
  };

  Game.prototype.toString = function() {
    return 'Game<#' + this.id + '>';
  };

  return Game;
};
