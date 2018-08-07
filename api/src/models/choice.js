module.exports = (sequelize, DataTypes) => {

  const Choice = sequelize.define('choice', {
    text: DataTypes.STRING,
    keepCapitalization: DataTypes.BOOLEAN,
    available: DataTypes.BOOLEAN,
  }, {
    tableName: 'choice',
  });

  Choice.associate = function({ Game, Player }) {
    Choice.belongsTo(Game, { as: 'game', foreignKey: 'gameId' });
    Choice.belongsTo(Player, { as: 'player', foreignKey: 'playerId' });
  };

  return Choice;

};
