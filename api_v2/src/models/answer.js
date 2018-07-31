module.exports = (sequelize, DataTypes) => {

  const Answer = sequelize.define('answer', {}, {});

  Answer.associate = function({ Question, Choice }) {
    Answer.hasOne(Question, { as: 'question', foreignKey: 'questionId' });
    Answer.hasOne(Choice, { as: 'choice', foreignKey: 'choiceId' });
  };

  return Answer;
};