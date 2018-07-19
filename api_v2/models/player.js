module.exports = (sequelize, DataTypes) => {

  const Player = sequelize.define('Player', {
    nick: DataTypes.STRING,
    socket: DataTypes.STRING,
    avatar: DataTypes.STRING,
  }, {
    tableName: 'player',
  });

  Player.associate = function({ Game }) {
    Player.belongsTo(Game, { as: 'game', foreignKey: 'gameId' })
  };

  return Player;
};
