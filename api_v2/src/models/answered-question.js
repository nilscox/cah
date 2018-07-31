module.exports = (sequelize, DataTypes) => {

  const AnsweredQuestion = sequelize.define('answeredquestion', {
    place: DataTypes.INTEGER,
  }, {});

  AnsweredQuestion.associate = function({ }) {

  };

  return AnsweredQuestion;
};