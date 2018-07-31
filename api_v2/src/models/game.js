module.exports = (sequelize, DataTypes) => {

  const Game = sequelize.define('Game', {
    lang: DataTypes.STRING,
    state: DataTypes.STRING,
  }, {
    tableName: 'game',
  });

  Game.associate = function({ Player, GameTurn }) {
    Game.belongsTo(Player, { as: 'owner', foreignKey: 'ownerId', targetKey: 'id' });
    Game.hasMany(Player, { as: 'players', foreignKey: 'gameId' });
    Game.hasMany(GameTurn, { as: 'turns', foreignKey: 'gameId' });

    Game.defaultScope = {
      include: ['players', 'owner'],
    };
  };

  return Game;
};
