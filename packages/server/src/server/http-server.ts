import { createServer, IncomingMessage, Server as NodeServer } from 'node:http';
import { promisify } from 'node:util';

import bodyParser from 'body-parser';
import { Container } from 'ditox';
import express, { ErrorRequestHandler, RequestHandler, Router } from 'express';
import session from 'express-session';
import createMemoryStore from 'memorystore';
import morgan from 'morgan';
import * as yup from 'yup';

import { ConfigPort, LoggerPort } from 'src/adapters';
import { TOKENS } from 'src/tokens';
import { defined } from 'src/utils/defined';

declare module 'express-session' {
  interface SessionData {
    playerId: string;
  }
}

const MemoryStore = createMemoryStore(session);

/* eslint-disable @typescript-eslint/no-misused-promises */

export class HttpServer {
  private app: express.Express;
  private server: NodeServer;

  private sessionStore = new MemoryStore({});

  constructor(
    private readonly config: ConfigPort,
    private readonly logger: LoggerPort,
    private readonly container: Container,
  ) {
    this.app = express();
    this.server = createServer(this.app);

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

    router.post('/authenticate', async (req, res) => {
      const { nick } = await authenticateBodySchema.validate(req.body);
      const handler = this.container.resolve(TOKENS.commands.authenticate);

      const playerId = await handler.execute({ nick });

      req.session.playerId = playerId;
      res.status(201).end();
    });

    router.post('/game', this.authenticated, async (req, res) => {
      const playerId = defined(req.session.playerId);
      const handler = this.container.resolve(TOKENS.commands.createGame);

      await handler.execute({ playerId });
      res.status(201).end();
    });

    router.put('/game/:code/join', this.authenticated, async (req, res) => {
      const playerId = defined(req.session.playerId);
      const code = req.params.code;
      const handler = this.container.resolve(TOKENS.commands.joinGame);

      await handler.execute({ code, playerId });
      res.status(201).end();
    });

    router.put('/game/start', this.authenticated, async (req, res) => {
      const playerId = defined(req.session.playerId);
      const player = await this.container.resolve(TOKENS.queries.getPlayer).execute({ playerId });

      assert(player.gameId, 'player is not in a game');

      const handler = this.container.resolve(TOKENS.commands.startGame);

      await handler.execute({ playerId, gameId: player.gameId, numberOfQuestions: 10 });
      res.status(201).end();
    });

    router.post('/game/answer', this.authenticated, async (req, res) => {
      const playerId = defined(req.session.playerId);
      const { choicesIds } = await createAnswerBodySchema.validate(req.body);
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

    router.get('/game/:gameId', async (req, res) => {
      const handler = this.container.resolve(TOKENS.queries.getGame);

      res.json(await handler.execute({ gameId: req.params.gameId }));
    });

    router.get('/player', this.authenticated, async (req, res) => {
      const playerId = defined(req.session.playerId);
      const handler = this.container.resolve(TOKENS.queries.getPlayer);

      res.json(await handler.execute({ playerId }));
    });

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
      res.send(err instanceof Error ? err.message : 'Unknown error');
    }) satisfies ErrorRequestHandler);

    return router;
  }
}

const authenticateBodySchema = yup.object({
  nick: yup.string().min(2).max(24).required(),
});

const createAnswerBodySchema = yup.object({
  choicesIds: yup.array(yup.string().required()).min(1).required(),
});
