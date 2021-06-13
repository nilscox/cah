import { classToPlain } from 'class-transformer';
import { Router } from 'express';
import { Container } from 'typedi';

import { Game, GameState } from '../../../domain/entities/Game';
import { CreateGame } from '../../../domain/use-cases/CreateGame';
import { QueryGame } from '../../../domain/use-cases/QueryGame';
import { GameDto, StartedGameDto } from '../../dtos/entities/GameDto';
import { isPlayer } from '../guards/isPlayer';

export const router = Router();

declare module 'express-serve-static-core' {
  interface Request {
    game?: Game;
  }
}

router.param('gameId', async (req, res, next) => {
  const gameId = Number(req.params.gameId);

  if (Number.isNaN(gameId) || gameId <= 0) {
    return res.status(400).json({ error: 'expected gameId to be a positive number' });
  }

  try {
    const game = await Container.get(QueryGame).queryGame(gameId);

    if (!game) {
      return res.status(404).json({ error: `game with id ${gameId} was not found` });
    }

    req.game = game;

    next();
  } catch (error) {
    next(error);
  }
});

router.get('/:gameId', (req, res) => {
  const game = req.game!;
  const Dto = game.state === GameState.started ? StartedGameDto : GameDto;

  res.json(classToPlain(new Dto(req.game!)));
});

router.post('/', isPlayer, async (_req, res, next) => {
  try {
    const createGame = Container.get(CreateGame);
    const game = await createGame.createGame();

    res.status(201).json(game);
  } catch (error) {
    next(error);
  }
});
