module.exports = {

  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'choice',
      'playerId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'game',
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
