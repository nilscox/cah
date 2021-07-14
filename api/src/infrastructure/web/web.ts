import express, { ErrorRequestHandler, Express } from 'express';
import expressSession from 'express-session';

import { errorHandler, FallbackRoute } from './Route';

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
  const app = express();

  const session = expressSession({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
  });

  app.use(session);
  app.use(express.json());

  for (const route of routes) {
    route.register(app);
  }

  fallbackErrorHandler.register(app);

  return app;
};
