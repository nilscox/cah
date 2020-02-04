import { RequestHandler } from 'express';

import APIError from './APIError';

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

export const isInGame: RequestHandler = (req, res, next) => {
  if (!req.game)
    throw new APIError(403, 'you must be in game');

  next();
};
