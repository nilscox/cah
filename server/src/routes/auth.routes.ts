import express from 'express';

import APIError from '../APIError';
import { formatPlayer, formatGame } from '../format';
import { isAuthenticated, isNotAuthenticated } from '../guards';

const router = express.Router();

router.post('/signup', isNotAuthenticated, (req, res) => {
  const {
    body,
    state: { players },
  } = req;

  if (!body.nick) {
    throw new APIError(400, 'missing nick');
  }

  const { nick } = body;

  const getPlayer = () => {
    const existingPlayer = players.find(p => p.nick.toLowerCase() === nick.toLowerCase());

    if (existingPlayer) {
      if (existingPlayer.socket) {
        throw new APIError(400, 'nick already taken');
      }

      return existingPlayer;
    }

    const player = { nick, created: new Date() };

    players.push(player);

    return player;
  };

  const player = getPlayer();

  req.session!.nick = player.nick;

  res.status(201);
  res.json(formatPlayer(player, true));
});

router.post('/logout', isAuthenticated, (req, res) => {
  const {
    player,
    state: { players },
  } = req;

  players.splice(players.indexOf(player!), 1);

  delete req.session!.nick;

  res.status(204).end();
});

router.get('/me', isAuthenticated, (req, res) => {
  res.json({
    player: formatPlayer(req.player!, true),
    ...(req.game && { game: formatGame(req.game, true) }),
  });
});

export default router;
