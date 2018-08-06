module.exports = {

  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('game', 'ownerId', {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'player', key: 'id' },
      }),
      queryInterface.addColumn('game', 'questionMasterId', {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: { model: 'player', key: 'id' },
      }),
      queryInterface.addColumn('game', 'questionId', {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: { model: 'question', key: 'id' },
      }),
      queryInterface.addColumn('game', 'selectedAnswerId', {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: { model: 'answer', key: 'id' },
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('game', 'ownerId'),
      queryInterface.removeColumn('game', 'questionMasterId'),
    ]);
  }

};
