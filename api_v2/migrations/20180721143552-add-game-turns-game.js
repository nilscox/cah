module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'gameturn',
      'gameId',
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
      'gameturn',
      'gameId',
    );
  }

};
