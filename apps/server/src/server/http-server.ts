import { createServer, IncomingMessage, Server as NodeServer } from 'node:http';
import { Socket } from 'node:net';
import { promisify } from 'node:util';

import * as shared from '@cah/shared';
import { defined } from '@cah/utils';
import bodyParser from 'body-parser';
import connectPgSimple from 'connect-pg-simple';
import { Container } from 'ditox';
import express, { ErrorRequestHandler, RequestHandler, Router } from 'express';
import session, { MemoryStore } from 'express-session';
import morgan from 'morgan';
import * as yup from 'yup';

import { ConfigPort, LoggerPort } from 'src/adapters';
import { EntityNotFoundError } from 'src/persistence';
import { TOKENS } from 'src/tokens';

declare module 'express-session' {
  interface SessionData {
    playerId: string;
  }
}

const PgSessionStore = connectPgSimple(session);

/* eslint-disable @typescript-eslint/no-misused-promises */

export class HttpServer {
  private app: express.Express;
  private server: NodeServer;

  private sockets = new Set<Socket>();

  private sessionStore: session.Store;

  constructor(
    private readonly config: ConfigPort,
    private readonly logger: LoggerPort,
    private readonly container: Container,
  ) {
    this.app = express();
    this.server = createServer(this.app);

    if (config.session.store === 'database') {
      this.sessionStore = new PgSessionStore({
        conString: config.database.url,
        schemaName: 'cah',
        tableName: 'sessions',
        createTableIfMissing: true,
      });
    } else {
      this.sessionStore = new MemoryStore();
    }

    this.server.on('connection', (socket) => {
      this.sockets.add(socket);

      socket.on('close', () => {
        this.sockets.delete(socket);
      });
    });

    this.configure();
  }

  get nodeServer() {
    return this.server;
  }

  async listen() {
    const { host, port } = this.config.server;

    await promisify((cb: () => void) => {
      this.server.listen(port, host, cb);
    })();

    this.logger.info(`server listening on ${host}:${port}`);
  }

  async close() {
    for (const socket of this.sockets.values()) {
      socket.destroy();
    }

    if (this.server.listening) {
      await promisify<void>((cb) => this.server.close(cb))();
    }
  }

  private configure() {
    this.app.set('trust proxy', 1);

    this.app.use(this.sessionMiddleware);
    this.app.use(this.loggerMiddleware);
    this.app.use(bodyParser.json());
    this.app.use(this.endpoints());
    this.app.use(this.errorHandler);
  }

  private get loggerMiddleware() {
    const logger = this.logger;

    type Req = IncomingMessage & { session: session.SessionData };

    const format: morgan.FormatFn = (tokens, req, res) => {
      return [
        tokens['remote-addr'](req, res),
        (req as Req).session.playerId ?? 'unauthenticated',
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        `${Math.ceil(Number(tokens['response-time'](req, res)))}ms`,
      ].join(' ');
    };

    return morgan(format, {
      stream: {
        write(line) {
          logger.verbose(line.replace(/\n$/, ''));
        },
      },
    });
  }

  get sessionMiddleware() {
    return session({
      secret: 'secret',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
      store: this.sessionStore,
    });
  }

  private errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
    const error = err instanceof Error ? err : new Error('Unknown error');

    console.error(err);

    res.status(500);
    res.send(error.message);
  };

  private authenticated: RequestHandler = (req, res, next) => {
    if (!req.session.playerId) {
      res.status(401).send('request must be authenticated');
    } else {
      next();
    }
  };

  private endpoints() {
    const router = Router();

    router.get('/health-check', (req, res) => {
      res.status(200).end();
    });

    router.get('/game/:gameId', async (req, res) => {
      const gameRepository = this.container.resolve(TOKENS.repositories.game);

      res.json(await gameRepository.query(req.params.gameId));
    });

    router.get('/game/:gameId/turns', async (req, res) => {
      const turnRepository = this.container.resolve(TOKENS.repositories.turn);

      res.json(await turnRepository.queryForGame(req.params.gameId));
    });

    router.get('/player', this.authenticated, async (req, res) => {
      const playerId = defined(req.session.playerId);
      const playerRepository = this.container.resolve(TOKENS.repositories.player);

      res.json(await playerRepository.query(playerId));
    });

    router.post('/authenticate', async (req, res) => {
      const { nick } = await shared.authenticateBodySchema.validate(req.body);
      const handler = this.container.resolve(TOKENS.commands.authenticate);

      const playerId = await handler.execute({ nick });

      req.session.playerId = playerId;
      res.status(201).end();
    });

    router.delete('/authentication', this.authenticated, async (req, res) => {
      delete req.session.playerId;
      res.status(204).end();
    });

    router.post('/game', this.authenticated, async (req, res) => {
      const playerId = defined(req.session.playerId);
      const handler = this.container.resolve(TOKENS.commands.createGame);

      const gameId = await handler.execute({ playerId });

      res.status(201);
      res.header('Content-Type', 'text/plain');
      res.send(gameId);
    });

    router.put('/game/:code/join', this.authenticated, async (req, res) => {
      const playerId = defined(req.session.playerId);
      const code = req.params.code;
      const handler = this.container.resolve(TOKENS.commands.joinGame);

      const gameId = await handler.execute({ code, playerId });

      res.status(200);
      res.header('Content-Type', 'text/plain');
      res.send(gameId);
    });

    router.put('/game/leave', this.authenticated, async (req, res) => {
      const playerId = defined(req.session.playerId);
      const handler = this.container.resolve(TOKENS.commands.leaveGame);

      await handler.execute({ playerId });

      res.status(200).end();
    });

    router.put('/game/start', this.authenticated, async (req, res) => {
      const playerId = defined(req.session.playerId);
      const { numberOfQuestions } = await shared.startGameBodySchema.validate(req.body);
      const handler = this.container.resolve(TOKENS.commands.startGame);

      await handler.execute({ playerId, numberOfQuestions });

      res.status(201).end();
    });

    router.post('/game/answer', this.authenticated, async (req, res) => {
      const playerId = defined(req.session.playerId);
      const { choicesIds } = await shared.createAnswerBodySchema.validate(req.body);
      const handler = this.container.resolve(TOKENS.commands.createAnswer);

      await handler.execute({ playerId, choicesIds });

      res.status(200).end();
    });

    router.put('/game/answer/:answerId/select', this.authenticated, async (req, res) => {
      const playerId = defined(req.session.playerId);
      const answerId = req.params.answerId;
      const handler = this.container.resolve(TOKENS.commands.selectWinningAnswer);

      await handler.execute({ playerId, answerId });

      res.status(200).end();
    });

    router.put('/game/end-turn', this.authenticated, async (req, res) => {
      const playerId = defined(req.session.playerId);
      const handler = this.container.resolve(TOKENS.commands.endTurn);

      await handler.execute({ playerId });

      res.status(200).end();
    });

    router.use(((err: unknown, req, res, next) => {
      if (err instanceof EntityNotFoundError) {
        res.status(404);
        res.json({ message: err.message, ...err.criteria });
      } else {
        next(err);
      }
    }) satisfies ErrorRequestHandler);

    router.use(((err: unknown, req, res, next) => {
      if (err instanceof yup.ValidationError) {
        res.status(400);
        res.json({ message: err.message, type: err.type, path: err.path });
      } else {
        next(err);
      }
    }) satisfies ErrorRequestHandler);

    router.use(((err: unknown, req, res, _next) => {
      console.debug(err);

      res.status(500);
      res.header('Content-Type', 'text/plain');
      res.send(err instanceof Error ? err.message : 'Unknown error');
    }) satisfies ErrorRequestHandler);

    return router;
  }
}
