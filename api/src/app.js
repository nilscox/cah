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
  // TODO: fix this evil trick
  res.append('Access-Control-Allow-Origin', req.get('origin') || '*');
  res.append('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.append('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(async (req, res, next) => {
  try {
    req.admin = req.session.admin;

    const playerId = req.admin ? req.body.playerId : req.session.playerId;

    if (playerId)
      req.player = await Player.findOne({ where: { id: playerId } });

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
