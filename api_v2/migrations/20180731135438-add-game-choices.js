'use strict';

module.exports = {

  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'choice',
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
      'choice',
      'gameId',
    );
  },

};
