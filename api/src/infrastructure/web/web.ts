import * as http from 'http';

import connectSessionKnex from 'connect-session-knex';
import cors from 'cors';
import express, { ErrorRequestHandler, Express } from 'express';
import expressSession from 'express-session';
import knexFactory, { Knex } from 'knex';

import { ConfigService } from '../../application/interfaces/ConfigService';
import { Dependencies } from '../Dependencies';

import { errorHandler } from './middlewaresCreators';
import { FallbackRoute } from './Route';

export const createKnexConnection = (config: ConfigService) => {
  return knexFactory({
    useNullAsDefault: true,
    client: 'sqlite3',
    connection: {
      filename: config.get('DB_FILE') ?? ':memory:',
    },
  });
};

export const createKnexSessionStore = (knex: Knex) => {
  const KnexSessionStore = connectSessionKnex(expressSession);

  return new KnexSessionStore({
    tablename: 'sessions',
    createtable: true,
    // @ts-expect-error knex version issue
    knex,
  });
};

export interface Route {
  register: (app: Express) => void;
}

class FallbackErrorHandler {
  execute: ErrorRequestHandler = ({ message, status, ...error }, req, res) => {
    res.status(status ?? 500).json({ message, ...error });
  };
}

const fallbackErrorHandler = new FallbackRoute().use(errorHandler(new FallbackErrorHandler()));

export const createServer = (routes: Route[], { configService, websocketServer }: Dependencies) => {
  const session = expressSession({
    store: createKnexSessionStore(createKnexConnection(configService)),
    secret: configService.get('SESSION_SECRET') ?? 'si crête',
    resave: false,
    saveUninitialized: true,
  });

  const app = express();
  const server = http.createServer(app);

  websocketServer.connect(server, session);

  app.use(cors({ origin: true, credentials: true }));
  app.use(session);
  app.use(express.json());

  for (const route of routes) {
    route.register(app);
  }

  fallbackErrorHandler.register(app);

  return server;
};
