const Sequelize = require('sequelize');

const DB_HOST = process.env.CAH_APIS_DB_HOST;
const DB_PORT = process.env.CAH_APIS_DB_PORT;
const DB_USER = process.env.CAH_APIS_DB_USER;
const DB_PASSWORD = process.env.CAH_APIS_DB_PASSWORD;
const DB_NAME = process.env.CAH_APIS_DB_NAME;

module.exports = new Sequelize(
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  {
    host: DB_HOST,
    dialect: 'postgres',
  },
);
