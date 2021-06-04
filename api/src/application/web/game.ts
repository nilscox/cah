import { Router } from 'express';
import { Container } from 'typedi';

import { Game } from '../../domain/entities/Game';
import { QueryGame } from '../../domain/use-cases/QueryGame';

declare module 'express-serve-static-core' {
  interface Request {
    game?: Game;
  }
}

export const router = Router();

router.param('gameId', async (req, res, next) => {
  const gameId = Number(req.params.gameId);

  if (Number.isNaN(gameId) || gameId <= 0) {
    return res.status(400).json({ error: 'expected gameId to be a positive number' });
  }

  const queryGame = Container.get(QueryGame);

  try {
    const game = await queryGame.queryGame(gameId);

    if (!game) {
      return res.status(404).json({ error: `game with id ${gameId} was not found` });
    }

    req.game = game;
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }

  next();
});

router.get('/:gameId', (req, res) => {
  res.json(req.game);
});
