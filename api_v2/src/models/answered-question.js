module.exports = (sequelize, DataTypes) => {

  const AnsweredQuestion = sequelize.define('answeredquestion', {
    place: DataTypes.NUMBER,
  }, {});

  AnsweredQuestion.associate = function(models) {

  };

  return AnsweredQuestion;
};