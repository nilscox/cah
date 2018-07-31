module.exports = (sequelize, DataTypes) => {

  const Answer = sequelize.define('answer', {}, {});

  Answer.associate = function(models) {

  };

  return Answer;
};