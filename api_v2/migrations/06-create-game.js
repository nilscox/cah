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
        allowNull: false,
        type: Sequelize.STRING,
      },
      state: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: 'idle',
      },
      nbQuestions: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      cardsPerPlayer: {
        allowNull: false,
        type: Sequelize.INTEGER,
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
