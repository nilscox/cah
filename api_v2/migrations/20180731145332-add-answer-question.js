module.exports = {

  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'answer',
      'questionId',
      {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'question',
          key: 'id',
        },
      },
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'answer',
      'questionId',
    );
  },

};
