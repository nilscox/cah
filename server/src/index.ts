/// <reference path="./index.d.ts" />

import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import socketio from 'socket.io';

import { State } from './types/State';
import { Player } from './types/Player';

import auth from './routes/auth.routes';
import game from './routes/game.routes';

const questions = require('../data/fr/questions');
const choices = require('../data/fr/choices');

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
  res.json({
    players: req.state.players.map(player => ({
      ...player,
      socket: player.socket?.id,
    })),
    games: req.state.games,
  });
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
      io.in(player.gameId).send({ type: 'connected', nick: player.nick });
    }
  });

  socket.on('disconnect', () => {
    if (player) {
      delete player.socket;

      if (player.gameId)
        io.in(player.gameId).send({ type: 'disconnected', nick: player.nick });
    }
  });
});

server.listen(4242, () => console.log('server started'));
