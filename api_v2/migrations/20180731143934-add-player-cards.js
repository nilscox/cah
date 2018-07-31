module.exports = {

  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'choice',
      'playerId',
      {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'player',
          key: 'id',
        },
      },
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'choice',
      'playerId',
    );
  },

};
