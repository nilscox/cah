module.exports = {

  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('question', 'gameId', {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'game', key: 'id' },
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('question', 'gameId'),
    ]);
  },

};
