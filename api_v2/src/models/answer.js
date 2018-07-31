module.exports = (sequelize, DataTypes) => {

  const Answer = sequelize.define('answer', {}, {});

  Answer.associate = function({ Choice }) {
    Answer.hasOne(Choice, { as: 'card', foreignKey: 'choiceId' });
  };

  return Answer;
};