global.Promise = require('bluebird');

const fs = require('fs');
const path = require('path');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const sessionMiddleware = require('express-session');

const { getEnv, log, error } = require('./utils');
const { APIError } = require('./errors');
const { Player } = require('./models');
const routes = require('./routes');
const events = require('./events');
const websockets = require('./websockets');

const app = express();
const server = http.Server(app);
const session = sessionMiddleware({
  secret: 'kernelpanic',
  cookie: {},
  resave: false,
  saveUninitialized: true,
});

module.exports = server;

app.set('x-powered-by', false);

app.use(bodyParser.json());
app.use(session);

websockets(server, session, events);

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
  if (!(err instanceof APIError)) {
    error('REQUEST', err);
    throw err;
  }

  log('REQUEST', err.message);

  res.status(err.status).json(err.toJSON());
});
