module.exports = (sequelize, DataTypes) => {

  const GameTurn = sequelize.define('GameTurn', {}, {
    tableName: 'gameturn',
  });

  GameTurn.associate = function({ Game, Player, Question }) {
    GameTurn.belongsTo(Game, { as: 'game', foreignKey: 'gameId' });
    GameTurn.belongsTo(Player, { as: 'questionMaster', foreignKey: 'questionMasterId' });
    GameTurn.belongsTo(Player, { as: 'winner', foreignKey: 'winnerId' });
    GameTurn.belongsTo(Question, { as: 'question', foreignKey: 'questionId' });
  };

  return GameTurn;
};