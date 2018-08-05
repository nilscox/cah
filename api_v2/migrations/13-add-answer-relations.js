module.exports = {

  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('answer', 'questionId', {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'question', key: 'id' },
      }),
      queryInterface.addColumn('answer', 'playerId', {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'player', key: 'id' },
      }),
      queryInterface.addColumn('answer', 'gameturnId', {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: { model: 'gameturn', key: 'id' },
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('answer', 'questionId'),
      queryInterface.removeColumn('answer', 'playerId'),
      queryInterface.removeColumn('answer', 'gameturnId'),
    ]);
  },

};
