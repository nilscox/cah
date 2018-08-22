const path = require('path');
const Sequelize = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const models = {
  MasterQuestion: 'master-question.js',
  MasterChoice: 'master-choice.js',
  Question: 'question.js',
  Choice: 'choice.js',
  Player: 'player.js',
  Game: 'game.js',
  GameTurn: 'game-turn.js',
  Answer: 'answer.js',
};

const db = Object.keys(models).reduce((db, name) => {
  db[name] = sequelize['import'](path.join(__dirname, models[name]));

  return db;
}, {});

Object.values(db).forEach(model => {
  if (model.associate)
    model.associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
