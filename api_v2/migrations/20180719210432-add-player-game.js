'use strict';

module.exports = {

  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'player',
      'gameId',
      {
        type: Sequelize.INTEGER,
        onDelete: 'SET NULL',
        references: {
          model: 'game',
          key: 'id',
        },
      },
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'player',
      'gameId',
    );
  },

};
