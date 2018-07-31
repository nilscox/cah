module.exports = (sequelize, DataTypes) => {

  const Choice = sequelize.define('choice', {
    text: DataTypes.STRING,
    keep_capitalization: DataTypes.BOOLEAN,
    available: DataTypes.BOOLEAN,
    played: DataTypes.BOOLEAN,
  }, {});

  Choice.associate = function(models) {
    question.belongsTo(Game, { as: 'game', foreignKey: 'gameId' });
  };

  return Choice;
};