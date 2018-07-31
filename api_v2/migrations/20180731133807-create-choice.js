module.exports = {

  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('choices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      text: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      keep_capitalization: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      available: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      played: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
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
    return queryInterface.dropTable('choices');
  }

};
