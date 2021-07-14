import express, { ErrorRequestHandler, RequestHandler } from 'express';
import expressSession from 'express-session';

interface Route {
  method: 'get' | 'post';
  endpoint: string;
  handle: RequestHandler;
}

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const { message, status, ...error } = err;

  res.status(status ?? 500).json({ message, ...error });
  // console.error(err);
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

  for (const route of routes) {
    app[route.method](route.endpoint, route.handle);
  }

  app.use(errorHandler);

  return app;
};
