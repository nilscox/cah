module.exports = (sequelize, DataTypes) => {

  const Player = sequelize.define('Player', {
    nick: DataTypes.STRING,
    socket: DataTypes.STRING,
    avatar: DataTypes.STRING,
    extra: DataTypes.STRING,
  }, {
    tableName: 'player',
  });

  Player.associate = function({ Game, Choice }) {
    Player.belongsTo(Game, { as: 'game', foreignKey: 'gameId' });
    Player.hasMany(Choice, { as: 'cards', foreignKey: 'playerId' });
  };

  Player.prototype.toString = function() {
    return 'Player<#' + this.id + ' (' + this.nick + ')>';
  };

  return Player;
};
