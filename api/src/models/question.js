module.exports = (sequelize, DataTypes) => {

  const Question = sequelize.define('question', {
    text: DataTypes.STRING,
    blanks: DataTypes.ARRAY(DataTypes.INTEGER),
    available: DataTypes.BOOLEAN,
  }, {
    tableName: 'question',
  });

  Question.associate = function({ Game }) {
    Question.belongsTo(Game, { as: 'game', foreignKey: 'gameId' });
  };

  Question.prototype.getNbChoices = function() {
    if (!this.blanks)
      return 1;

    return this.blanks.length;
  };

  return Question;
};
