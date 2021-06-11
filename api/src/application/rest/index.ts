import express, { Router } from 'express';
import expressSession from 'express-session';

import { errorHandler } from './middlewares/errorHandler';
import { providePlayerMiddleware } from './middlewares/providePlayerMiddleware';
import { router as game } from './routes/game';
import { router as player } from './routes/player';

export const app = express();
const api = Router();

export const session = expressSession({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
});

api.use(express.json());
app.use(session);
api.use(providePlayerMiddleware);

api.use('/game', game);
api.use('/player', player);

api.use(errorHandler);

app.use('/api', api);
