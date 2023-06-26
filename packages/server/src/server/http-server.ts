import { createServer, IncomingMessage, Server as NodeServer } from 'node:http';
import { promisify } from 'node:util';

import bodyParser from 'body-parser';
import { Container } from 'ditox';
import express, { RequestHandler } from 'express';
import session from 'express-session';
import createMemoryStore from 'memorystore';
import morgan from 'morgan';
import * as yup from 'yup';

import { ConfigPort, LoggerPort } from 'src/adapters';
import { TOKENS } from 'src/tokens';
import { defined } from 'src/utils/defined';

import { gameToDto, playerToDto } from './game-mapper';

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
    private readonly container: Container
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

    const authenticated: RequestHandler = (req, res, next) => {
      if (!req.session.playerId) {
        res.status(401).send('request must be authenticated');
      } else {
        next();
      }
    };

    this.app.get('/health-check', (req, res) => {
      res.status(200).end();
    });

    this.app.post('/authenticate', async (req, res) => {
      const { nick } = await authenticateBodySchema.validate(req.body);
      const handler = this.container.resolve(TOKENS.commands.authenticate);

      const playerId = await handler.execute({ nick });

      req.session.playerId = playerId;
      res.status(201).end();
    });

    this.app.post('/game', authenticated, async (req, res) => {
      const playerId = defined(req.session.playerId);
      const handler = this.container.resolve(TOKENS.commands.createGame);

      await handler.execute({ playerId });
      res.status(201).end();
    });

    this.app.put('/game/:code/join', authenticated, async (req, res) => {
      const playerId = defined(req.session.playerId);
      const code = req.params.code;
      const handler = this.container.resolve(TOKENS.commands.joinGame);

      await handler.execute({ code, playerId });
      res.status(201).end();
    });

    this.app.put('/game/start', authenticated, async (req, res) => {
      const playerId = defined(req.session.playerId);
      const player = await this.container.resolve(TOKENS.queries.getPlayer).execute({ playerId });

      assert(player.gameId, 'player is not in a game');

      const handler = this.container.resolve(TOKENS.commands.startGame);

      await handler.execute({ playerId, gameId: player.gameId, numberOfQuestions: 10 });
      res.status(201).end();
    });

    this.app.get('/game/:gameId', async (req, res) => {
      const handler = this.container.resolve(TOKENS.queries.getGame);

      const game = await handler.execute({ gameId: req.params.gameId });
      res.json(gameToDto(game));
    });

    this.app.get('/player/:playerId', async (req, res) => {
      const handler = this.container.resolve(TOKENS.queries.getPlayer);

      const player = await handler.execute({ playerId: req.params.playerId });
      res.json(playerToDto(player));
    });

    this.app.get('/me', authenticated, async (req, res) => {
      const playerId = defined(req.session.playerId);
      const handler = this.container.resolve(TOKENS.queries.getPlayer);

      const player = await handler.execute({ playerId });
      res.json(playerToDto(player));
    });
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
}

const authenticateBodySchema = yup.object({
  nick: yup.string().min(2).max(24).required(),
});
