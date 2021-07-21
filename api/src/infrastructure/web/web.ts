import * as http from 'http';

import cors from 'cors';
import express, { ErrorRequestHandler, Express } from 'express';
import expressSession from 'express-session';
import sessionFileStore from 'session-file-store';

import { errorHandler } from './middlewaresCreators';
import { FallbackRoute } from './Route';
import { WebsocketServer } from './websocket';

export interface Route {
  register: (app: Express) => void;
}

class FallbackErrorHandler {
  execute: ErrorRequestHandler = ({ message, status, ...error }, req, res) => {
    res.status(status ?? 500).json({ message, ...error });
  };
}

const fallbackErrorHandler = new FallbackRoute().use(errorHandler(new FallbackErrorHandler()));

export const createServer = (routes: Route[], wss: WebsocketServer) => {
  const FileStore = sessionFileStore(expressSession);

  const session = expressSession({
    store: new FileStore(),
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
  });

  const app = express();
  const server = http.createServer(app);

  wss.connect(server, session);

  app.use(cors({ origin: true, credentials: true }));
  app.use(session);
  app.use(express.json());

  for (const route of routes) {
    route.register(app);
  }

  fallbackErrorHandler.register(app);

  return server;
};
