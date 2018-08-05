module.exports = {

  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('game', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      lang: {
        type: Sequelize.STRING,
      },
      state: {
        type: Sequelize.STRING,
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
    return queryInterface.dropTable('games');
  },

};
