'use strict';

module.exports = {

  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'game',
      'ownerId',
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
      'game',
      'ownerId',
    );
  }

};
