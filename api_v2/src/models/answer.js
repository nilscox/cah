module.exports = (sequelize, DataTypes) => {

  const Answer = sequelize.define('answer', {
    place: DataTypes.INTEGER,
  }, {});

  Answer.associate = function({ Question, Choice, Player }) {
    Answer.hasOne(Player, { as: 'player', foreignKey: 'playerId' });
    Answer.hasOne(Question, { as: 'question', foreignKey: 'questionId' });
    Answer.hasMany(Choice, { as: 'choices', foreignKey: 'choiceId' });
  };

  return Answer;
};