global.Promise = require('bluebird');

const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const { Player } = require('./models');
const routes = require('./routes');
const { APIError } = require('./errors');

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

app.use((req, res, next) => {
  if (!req.session.player)
    return next();

  Player.find({ where: { nick: req.session.player }})
    .then(player => {
      if (!player) {
        delete req.session.player;
        next();
      }

      req.player = player;
      next();
    })
    .catch(next);
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
