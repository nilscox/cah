import * as http from 'http';

import connectSessionKnex from 'connect-session-knex';
import cors from 'cors';
import express, { ErrorRequestHandler, Express, RequestHandler } from 'express';
import expressSession from 'express-session';
import Knex from 'knex';

import { ConfigService } from '../../application/interfaces/ConfigService';
import { Logger } from '../../application/interfaces/Logger';

import { errorHandler } from './middlewaresCreators';
import { FallbackRoute } from './Route';
import { WebsocketServer } from './websocket';

export const createKnexConnection = (config: ConfigService) => {
  return Knex({
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

export class WebServer {
  app = express();
  httpServer = http.createServer(this.app);
  websocketServer = new WebsocketServer();

  knex?: Knex;
  sessionStore?: expressSession.Store;
  session?: RequestHandler;

  init(config: ConfigService) {
    const storeSessions = config.get('SESSION_STORE_DB') === 'true';

    if (storeSessions) {
      this.knex = createKnexConnection(config);
      this.sessionStore = createKnexSessionStore(this.knex);
    }

    this.session = expressSession({
      store: this.sessionStore,
      secret: config.get('SESSION_SECRET') ?? 'si crête',
      resave: false,
      saveUninitialized: true,
    });

    this.websocketServer.connect(this.httpServer, this.session);

    this.app.use(cors({ origin: true, credentials: true }));
    this.app.use(this.session);
    this.app.use(express.json());
  }

  register(routes: Route[]) {
    for (const route of routes) {
      route.register(this.app);
    }

    fallbackErrorHandler.register(this.app);
  }

  async listen(config: ConfigService, logger: Logger) {
    const port = Number(config.get('LISTEN_PORT') ?? '4242');
    const hostname = config.get('LISTEN_HOST') ?? 'localhost';

    if (port && (isNaN(port) || port <= 0)) {
      throw new Error(`LISTEN_PORT = "${config.get('LISTEN_PORT')}" is not a positive integer`);
    }

    await new Promise<void>((resolve) => {
      this.httpServer.listen(port, hostname, resolve);
    });

    logger.info(`server listening on ${hostname}:${port}`);
  }

  async close() {
    if (this.httpServer.listening) {
      await new Promise<void>((resolve, reject) => {
        this.httpServer.close((err) => (err ? reject(err) : resolve()));
      });
    }

    if (this.knex) {
      await this.knex.destroy();
    }
  }
}
