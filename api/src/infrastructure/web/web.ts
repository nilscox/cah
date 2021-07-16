import express, { ErrorRequestHandler, Express } from 'express';
import expressSession from 'express-session';
import * as http from 'http';

import { errorHandler } from './middlewaresCreators';
import { FallbackRoute } from './Route';
import { WebsocketServer } from './websocket';

interface Route {
  register: (app: Express) => void;
}

class FallbackErrorHandler {
  execute: ErrorRequestHandler = ({ message, status, ...error }, req, res) => {
    res.status(status ?? 500).json({ message, ...error });
  };
}

const fallbackErrorHandler = new FallbackRoute().use(errorHandler(new FallbackErrorHandler()));

export const bootstrapServer = (routes: Route[]) => {
  const session = expressSession({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
  });

  const app = express();
  const server = http.createServer(app);
  const wss = new WebsocketServer(server, session);

  app.use(session);
  app.use(express.json());

  for (const route of routes) {
    route.register(app);
  }

  fallbackErrorHandler.register(app);

  return [app, server, wss] as const;
};
