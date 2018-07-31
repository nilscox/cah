module.exports = (sequelize, DataTypes) => {

  const choice = sequelize.define('choice', {
    text: DataTypes.STRING,
    keep_capitalization: DataTypes.BOOLEAN,
    available: DataTypes.BOOLEAN,
    played: DataTypes.BOOLEAN,
  }, {});

  choice.associate = function(models) {

  };

  return choice;
};