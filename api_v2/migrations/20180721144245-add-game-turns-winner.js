module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'gameturn',
      'winnerId',
      {
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
      'gameturn',
      'winnerId',
    );
  }

};
