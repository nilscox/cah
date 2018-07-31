'use strict';
module.exports = (sequelize, DataTypes) => {
  var answered - question = sequelize.define('answered-question', {
    place: DataTypes.NUMBER
  }, {});
  answered - question.associate = function(models) {
    // associations can be defined here
  };
  return answered - question;
};