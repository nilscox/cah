module.exports = (sequelize, DataTypes) => {

  const Answer = sequelize.define('answer', {
    place: DataTypes.INTEGER,
  }, {
    tableName: 'answer',
  });

  Answer.associate = function({ Question, Choice, Player }) {
    Answer.belongsTo(Player, { as: 'player', foreignKey: 'playerId' });
    Answer.belongsTo(Question, { as: 'question', foreignKey: 'questionId' });
    Answer.hasMany(Choice, { as: 'choices', foreignKey: 'answerId' });
  };

  return Answer;
};