module.exports = {

  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('choice', 'place', {
      allowNull: true,
      type: Sequelize.INTEGER,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('choice', 'place');
  },

};
