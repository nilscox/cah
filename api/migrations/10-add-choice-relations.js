module.exports = {

  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('choice', 'gameId', {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'game', key: 'id' },
      }),
      queryInterface.addColumn('choice', 'playerId', {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: { model: 'player', key: 'id' },
      }),
      queryInterface.addColumn('choice', 'answerId', {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: { model: 'answer', key: 'id' },
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('choice', 'gameId'),
      queryInterface.removeColumn('choice', 'playerId'),
      queryInterface.removeColumn('choice', 'answerId'),
    ]);
  },

};
