'use strict';

const env = process.env.NODE_ENV || 'development';

const path = require('path');
const Sequelize = require('sequelize');
const config = require(__dirname + '/../config/config')[env];

const models = {
  Player: 'player.js',
  Game: 'game.js',
  GameTurn: 'game-turn.js',
}

const loadDB = (sequelize) => {
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

  return db;
};

module.exports = loadDB(
  new Sequelize(config.database, config.username, config.password, config),
);

module.exports.withDatabase = dbName => loadDB(
  new Sequelize(dbName, config.username, config.password, config),
);
