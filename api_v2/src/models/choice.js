module.exports = (sequelize, DataTypes) => {

  const Choice = sequelize.define('choice', {
    text: DataTypes.STRING,
    keep_capitalization: DataTypes.BOOLEAN,
    available: DataTypes.BOOLEAN,
    played: DataTypes.BOOLEAN,
  }, {});

  Choice.associate = function({ Game, Player }) {
    Choice.belongsTo(Game, { as: 'game', foreignKey: 'gameId' });
    Choice.belongsTo(Player, { as: 'card', foreignKey: 'playerId' });
  };

  return Choice;
};