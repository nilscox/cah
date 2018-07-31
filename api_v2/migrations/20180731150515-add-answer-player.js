module.exports = {

  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'answer',
      'playerId',
      {
        allowNull: false,
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
      'answer',
      'playerId',
    );
  },

};
