import { RequestHandler } from 'express';

export const isPlayer: RequestHandler = (req, res, next) => {
  if (!req.player) {
    return res.status(401).end();
  }

  next();
};
