import { RequestHandler } from 'express';

import APIError from './APIError';
import { Game } from 'src/types/Game';

export const isNotAuthenticated: RequestHandler = (req, res, next) => {
  if (req.player)
    throw new APIError(403, 'you must not be authenticated');

  next();
};

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (!req.player)
    throw new APIError(403, 'you must be authenticated');

  next();
};

export const isNotInGame: RequestHandler = (req, res, next) => {
  if (req.game)
    throw new APIError(403, 'you must not be in game');

  next();
};

export const isInGame: (state?: Game['state'], playState?: Game['playState']) => RequestHandler = (state, playState) => (req, res, next) => {
  const { game } = req;

  if (!game)
    throw new APIError(403, 'you must be in game');

  if (state && game.state !== state)
    throw new APIError(400, 'state is not ' + state);

  if (state && game.playState !== playState)
    throw new APIError(400, 'play state is not ' + playState);

  next();
};
