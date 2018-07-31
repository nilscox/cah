'use strict';

module.exports = {

  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('player', 'gameId', {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: { model: 'game', key: 'id' },
        onDelete: 'SET NULL',
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('player', 'gameId'),
    ]);
  },

};
