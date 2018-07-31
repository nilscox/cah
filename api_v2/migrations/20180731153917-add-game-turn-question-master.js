module.exports = {

  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'gameturn',
      'questionMasterId',
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
      'questionMasterId',
    );
  },

};
