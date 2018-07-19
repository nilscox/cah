const config = {
  DB_HOST: process.env.CAH_DB_HOST,
  DB_PORT: process.env.CAH_DB_PORT,
  DB_USER: process.env.CAH_DB_USER,
  DB_PASSWORD: process.env.CAH_DB_PASSWORD,
  DB_NAME: process.env.CAH_DB_NAME,
};

['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'].forEach(v => {
  if (!config[v]) {
    console.log('missing env: ' + v);
    process.exit(1);
  }
});

module.exports = {
  'development': {
    username: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    host: config.DB_HOST,
    dialect: 'postgres',
  },
  'test': {},
  'production': {},
};
