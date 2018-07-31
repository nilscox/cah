module.exports = (sequelize, DataTypes) => {

  const AnsweredQuestion = sequelize.define('answered-question', {
    place: DataTypes.NUMBER,
  }, {});

  AnsweredQuestion.associate = function(models) {

  };

  return AnsweredQuestion;
};