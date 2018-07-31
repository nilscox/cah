module.exports = (sequelize, DataTypes) => {

  const GameTurn = sequelize.define('GameTurn', {}, {
    tableName: 'gameturn',
  });

  GameTurn.associate = function({ Game, Player }) {
    GameTurn.belongsTo(Game, { as: 'game', foreignKey: 'gameId' });
    GameTurn.belongsTo(Player, { as: 'winner', foreignKey: 'id' });
  };

  return GameTurn;
};