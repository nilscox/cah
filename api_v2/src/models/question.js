module.exports = (sequelize, DataTypes) => {

  const question = sequelize.define('question', {
    text: DataTypes.STRING,
    available: DataTypes.BOOLEAN,
  }, {});

  question.associate = function(models) {

  };

  return question;
};