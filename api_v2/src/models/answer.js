module.exports = (sequelize, DataTypes) => {

  const answer = sequelize.define('answer', {}, {});

  answer.associate = function(models) {

  };

  return answer;
};