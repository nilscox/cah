module.exports = {

  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('answeredquestion', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      place: {
        allowNull: true,
        type: Sequelize.NUMBER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('answeredquestion');
  },

};