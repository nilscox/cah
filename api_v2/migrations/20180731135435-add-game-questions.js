'use strict';

module.exports = {

  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'question',
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
      'question',
      'gameId',
    );
  },

};
