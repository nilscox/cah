module.exports = {

  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('gameturn', 'gameId', {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'game', key: 'id' },
      }),
      queryInterface.addColumn('gameturn', 'questionId', {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'question', key: 'id' },
      }),
      queryInterface.addColumn('gameturn', 'winnerId', {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'player', key: 'id' },
      }),
      queryInterface.addColumn('gameturn', 'questionMasterId', {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'player', key: 'id' },
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('gameturn', 'gameId'),
      queryInterface.removeColumn('gameturn','winnerId'),
      queryInterface.removeColumn('gameturn','questionMasterId'),
    ]);
  },

};
