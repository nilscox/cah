/// <reference path="./index.d.ts" />

import http from 'http';
import path from 'path';

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import socketio from 'socket.io';

import { State } from './types/State';
import { Player } from './types/Player';
import { Game } from './types/Game';

import auth from './routes/auth.routes';
import game from './routes/game.routes';

import * as events from './events';
import { log } from './log';

const {
  HOST = 'localhost',
  PORT = '4242',
  DATA_DIR = path.resolve(__dirname, '../../data'),
} = process.env;

const questions = require(path.resolve(DATA_DIR, 'fr', 'questions'));
const choices = require(path.resolve(DATA_DIR, 'fr', 'choices'));

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const state: State = {
  data: {
    questions,
    choices,
  },
  players: [],
  games: [],
};

app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true,
}));

app.use((req, res, next) => {
  req.state = state;
  req.io = io;
  next();
});

app.use((req, res, next) => {
  const nick = req.session?.nick;
  const { state: { players, games } } = req;

  if (nick) {
    const player = players.find(u => u.nick === nick);

    if (!player) {
      delete req.session!.nick;
    } else {
      req.player = player;

      if (player.gameId)
        req.game = games.find(g => g.id === player?.gameId);
      else
        delete player.gameId;
    }
  }

  next();
});

app.use('/api/auth', auth);

app.use('/api/game', game);

app.use('/api/state', (req, res) => {
  const formatPlayer = (player: Player) => ({
    ...player,
    socket: player.socket?.id,
  });

  res.json({
    players: req.state.players.map(formatPlayer),
    games: req.state.games.map(game => ({
      ...game,
      players: game.players.map(formatPlayer),
    })),
  });
});

app.get('/api/clean', (req, res) => {
  const { state } = req;
  const maxDuration = 24 * 60 * 60 * 1000;
  const now = new Date();

  const games = [];
  const players = [];

  for (const game of state.games) {
    const duration = now.getTime() - game.created.getTime();

    if (duration < maxDuration)
      games.push(game);
  }

  for (const player of state.players) {
    const duration = now.getTime() - player.created.getTime();

    if (duration < maxDuration)
      players.push(player);
  }

  state.games = games;
  state.players = players;

  res.status(204).end();
});

app.use((req, res) => {
  res.status(404).end();
});

app.use((err: any, req: any, res: any, next: any) => {

  if (err.status)
    res.status(err.status);
  else
    console.log(err.stack);

  res.send(err.message);
});

io.on('connection', socket => {
  let player: Player | undefined;

  socket.on('login', ({ nick }) => {
    player = state.players.find(p => p.nick === nick);

    if (!player)
      return;

    player.socket = socket;

    if (player.gameId) {
      socket.join(player.gameId);
      events.connected(io, { id: player.gameId } as Game, player)
    }
  });

  socket.on('disconnect', () => {
    if (player) {
      delete player.socket;

      if (player.gameId)
        events.disconnected(io, { id: player.gameId } as Game, player)
    }
  });
});

server.listen(parseInt(PORT), HOST, () => log('server started'));
