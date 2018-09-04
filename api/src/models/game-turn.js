module.exports = (sequelize, DataTypes) => {

  const GameTurn = sequelize.define('GameTurn', {
    number: DataTypes.INTEGER,
  }, {
    tableName: 'gameturn',
  });

  GameTurn.associate = function({ Game, Player, Question, Answer }) {
    GameTurn.belongsTo(Game, { as: 'game', foreignKey: 'gameId' });
    GameTurn.belongsTo(Player, { as: 'questionMaster', foreignKey: 'questionMasterId' });
    GameTurn.belongsTo(Player, { as: 'winner', foreignKey: 'winnerId' });
    GameTurn.belongsTo(Question, { as: 'question', foreignKey: 'questionId' });
    GameTurn.hasMany(Answer, { as: 'answers', foreignKey: 'gameTurnId' });
  };

  GameTurn.prototype.toString = function() {
    return 'GameTurn<#' + this.id + ' (' + this.number + ')>';
  };

  return GameTurn;
};