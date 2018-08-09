global.Promise = require('bluebird');

const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const { Player } = require('./models');
const routes = require('./routes');
const { APIError } = require('./errors');

const ADMIN_TOKEN = process.env.CAH_API_ADMIN_TOKEN;

if (!ADMIN_TOKEN) {
  console.log('missing env: CAH_API_ADMIN_TOKEN');
  process.exit(1);
}

const app = express();

app.set('x-powered-by', false);

app.use(bodyParser.json());

app.use(session({
  secret: 'kernelpanic',
  cookie: {},
  resave: false,
  saveUninitialized: true,
}));

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', '*');
  res.append('Access-Control-Allow-Headers', 'Authorization');
  next();
});

app.use(async (req, res, next) => {
  try {
    if (req.get('Authorization') === ADMIN_TOKEN) {
      req.admin = true;

      if (req.body.playerId)
        req.player = await Player.findOne({ where: { id: req.body.playerId } });
    } else if (req.session.player) {
      req.player = await Player.findOne({ where: { nick: req.session.player } });
    }

    next();
  } catch (e) {
    next(e);
  }
});

app.use('/api', routes);

app.use((err, req, res, next) => {
  if (process.env.NODE_ENV === 'development')
    console.log(err);

  if (!(err instanceof APIError))
    throw err;

  res.status(err.status).json(err.toJSON());
});

module.exports = app;
