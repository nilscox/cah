'use strict';

const env = process.env.NODE_ENV || 'development';

const path = require('path');
const Sequelize = require('sequelize');
const config = require(__dirname + '/../config/config')[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {};

db.Player = sequelize['import'](path.join(__dirname, 'player.js'));
db.Game = sequelize['import'](path.join(__dirname, 'game.js'));

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
