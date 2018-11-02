global.Promise = require('bluebird');

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const sessionMiddleware = require('express-session');
const morgan = require('morgan');
const sqlFormatter = require('sql-formatter');
const { ExpressExtraError } = require('express-extra');

const config = require('./config');
const { verbose, error, request: requestLogger } = require('./log');
const { APIError } = require('./errors');
const { Player } = require('./models');
const routes = require('./routes');
const websockets = require('./websockets');

require('./events/player-events');
require('./events/game-events');

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
app.use(morgan('combined', { stream: requestLogger.stream }));

websockets(server, session);

app.use(config.mediaRoot, express.static(config.mediaPath));

app.use((req, res, next) => {
  // TODO: fix this evil trick
  res.append('Access-Control-Allow-Origin', req.get('origin') || '*');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
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

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (!(err instanceof APIError) && !(err instanceof ExpressExtraError)) {
    if (err.name === 'SequelizeDatabaseError')
      error('REQUEST', err.message, '\n' + sqlFormatter.format(err.sql));
    else
      error('REQUEST', err);

    throw err;
  }

  verbose('REQUEST', err.message);

  res.status(err.status).json(err.toJSON());
});
