module.exports = (sequelize, DataTypes) => {

  const Answer = sequelize.define('answer', {
    place: DataTypes.INTEGER,
  }, {});

  Answer.associate = function({ Question, Choice, Player }) {
    Answer.belongsTo(Player, { as: 'player', foreignKey: 'answerId' });
    Answer.hasOne(Question, { as: 'question', foreignKey: 'questionId' });
    Answer.hasMany(Choice, { as: 'choices', foreignKey: 'choiceId' });
  };

  return Answer;
};