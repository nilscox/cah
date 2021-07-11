import { RequestHandler } from 'express';
import Container from 'typedi';

import { Player } from '../../../domain/entities/Player';
import { QueryPlayer } from '../../../domain/use-cases/QueryPlayer';

declare module 'express-serve-static-core' {
  interface Request {
    player?: Player;
  }
}

export const providePlayerMiddleware: RequestHandler = async (req, res, next) => {
  const { playerId } = req.session;

  if (!playerId) {
    return next();
  }

  try {
    const player = await Container.get(QueryPlayer).queryPlayer(playerId);

    if (!player) {
      throw new Error('Invalid state: req.session.playerId does not reference an existing player id');
    }

    req.player = player;

    next();
  } catch (error) {
    next(error);
  }
};
