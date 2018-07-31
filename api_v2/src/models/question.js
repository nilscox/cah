module.exports = (sequelize, DataTypes) => {

  const Question = sequelize.define('question', {
    text: DataTypes.STRING,
    available: DataTypes.BOOLEAN,
  }, {});

  Question.associate = function({ Game }) {
    Question.belongsTo(Game, { as: 'game', foreignKey: 'gameId' });
  };

  return Question;
};