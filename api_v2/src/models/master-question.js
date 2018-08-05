module.exports = (sequelize, DataTypes) => {

  const MasterQuestion = sequelize.define('masterquestion', {
    text: DataTypes.STRING,
    lang: DataTypes.STRING,
    blanks: DataTypes.ARRAY(DataTypes.INTEGER),
  }, {
    tableName: 'master_question',
  });

  return MasterQuestion;

};
