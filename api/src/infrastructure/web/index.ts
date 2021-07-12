import express, { ErrorRequestHandler } from 'express';
import expressSession from 'express-session';

import { Route } from './Route';

export interface Handler<Input, Result> {
  execute(input: Input): Result | Promise<Result>;
}

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const { message, status, ...error } = err;

  // console.error(error);
  res.status(status ?? 500).json({ message, ...error });
};

export const bootstrapServer = (routes: Route[]) => {
  const app = express();

  const session = expressSession({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
  });

  app.use(session);
  app.use(express.json());

  // app.use(providePlayerMiddleware);

  for (const route of routes) {
    app[route.method](route.endpoint, route.handle);
  }

  app.use(errorHandler);

  return app;
};
