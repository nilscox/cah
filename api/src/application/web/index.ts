import express, { Router } from 'express';

import { router as game } from './game';

export const app = express();

const api = Router();

api.use('/game', game);
app.use('/api', api);
