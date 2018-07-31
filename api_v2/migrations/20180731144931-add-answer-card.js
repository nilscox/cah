module.exports = {

  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'answer',
      'choiceId',
      {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'choice',
          key: 'id',
        },
      },
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'answer',
      'choiceId',
    );
  },

};
