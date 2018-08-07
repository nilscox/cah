module.exports = (sequelize, DataTypes) => {

  const MasterChoice = sequelize.define('masterchoice', {
    text: DataTypes.STRING,
    lang: DataTypes.STRING,
    keepCapitalization: DataTypes.BOOLEAN,
  }, {
    tableName: 'master_choice',
  });

  return MasterChoice;

};
