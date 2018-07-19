module.exports = (sequelize, DataTypes) => {

  const Game = sequelize.define('Game', {
    lang: DataTypes.STRING,
    state: DataTypes.STRING,
  }, {
    tableName: 'game',
    // defaultScope: {
    //   include: 'players',
    // },
  });

  Game.associate = function({ Player }) {
    Game.hasMany(Player, { as: 'players', foreignKey: 'gameId' });
    Game.belongsTo(Player, { as: 'owner', foreignKey: 'ownerNick', targetKey: 'nick' })
  };

  return Game;
};
