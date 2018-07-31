module.exports = (sequelize, DataTypes) => {

  const Game = sequelize.define('Game', {
    lang: DataTypes.STRING,
    state: DataTypes.STRING,
  }, {
    tableName: 'game',
  });

  Game.associate = function({ Question, Choice, Player, GameTurn }) {
    Game.belongsTo(Player, { as: 'owner', foreignKey: 'ownerId', targetKey: 'id' });
    Game.hasMany(Player, { as: 'players', foreignKey: 'gameId' });
    Game.hasMany(GameTurn, { as: 'turns', foreignKey: 'gameId' });
    Game.hasMany(Question, { as: 'questions', foreignKey: 'gameId' });
    Game.hasMany(Choice, { as: 'choices', foreignKey: 'gameId' });

    Game.defaultScope = {
      include: ['players', 'owner'],
    };
  };

  return Game;
};
