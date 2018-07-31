module.exports = {

  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'choice',
      'answerId',
      {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'answer',
          key: 'id',
        },
      },
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'choice',
      'answerId',
    );
  },

};
