import express, { Router } from 'express';
import session from 'express-session';

import { errorHandler } from './errorHandler';
import { router as game } from './game';
import { router as player } from './player';
import { providePlayerMiddleware } from './providePlayerMiddleware';

export const app = express();

const api = Router();

api.use(express.json());

app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
  }),
);

api.use(providePlayerMiddleware);

api.use('/game', game);
api.use('/player', player);

api.use(errorHandler);

app.use('/api', api);
