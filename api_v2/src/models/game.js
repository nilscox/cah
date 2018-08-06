const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = (sequelize, DataTypes) => {

  const Game = sequelize.define('Game', {
    lang: DataTypes.STRING,
    state: DataTypes.STRING,
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

    Game.defaultScope = {
      include: ['players', 'owner'],
    };
  };

  /**
   * Create the questions and choices from master data
   * @param MasterQuesiton
   * @param MasterChoice
   * @param Question
   * @param Choice
   * @param opts.questions {number} - the number of questions
   * @param opts.choices {number} - the number of choices
   */
  Game.prototype.createCards = async function(opts = {}) {
    const MasterQuestion = sequelize.model('masterquestion');
    const MasterChoice = sequelize.model('masterchoice');
    const Question = sequelize.model('question');
    const Choice = sequelize.model('choice');

    const getEntity = async (Model, limit) => {
      let instances = await Model.findAll({
        where: { lang: this.lang },
        order: Sequelize.fn('RANDOM'),
        limit,
      });

      return instances.map(i => {
        const values = i.get();

        values.available = true;
        values.gameId = this.id;

        return values;
      });
    };

    await Question.bulkCreate(await getEntity(MasterQuestion, opts.questions));
    await Choice.bulkCreate(await getEntity(MasterChoice, opts.choices));
  }

  Game.prototype.getPropositions = async function() {
    if (!this.questionId)
      return;

    return await this.getAnswers({
      where: {
        questionId: { [Op.eq]: this.questionId },
      },
      orderBy: ['place'],
      include: ['choices'],
    });
  }

  return Game;
};
