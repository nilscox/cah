import assert from 'node:assert';
import { createServer, Server as NodeServer } from 'node:http';
import { promisify } from 'node:util';

import { Container } from 'ditox';
import express from 'express';
import morgan from 'morgan';

import { ConfigPort, RealEventPublisherAdapter, LoggerPort } from '../adapters';
import { GameCreatedEvent } from '../commands/game/create-game/create-game';
import { TOKENS } from '../tokens';

/* eslint-disable @typescript-eslint/no-misused-promises */

export class Server {
  private app: express.Express;
  private server: NodeServer;

  constructor(
    private readonly config: ConfigPort,
    private readonly logger: LoggerPort,
    private readonly container: Container
  ) {
    this.logger.context = 'Server';

    this.app = express();
    this.server = createServer(this.app);
    this.configure();
  }

  get addr() {
    const addr = this.server.address();

    if (typeof addr === 'object' && addr !== null) {
      return addr;
    }
  }

  get url() {
    if (!this.addr) {
      return;
    }

    return `http://${this.addr.address}:${this.addr.port}`;
  }

  async listen() {
    const { host, port } = this.config.server;

    await promisify((cb: () => void) => {
      this.server.listen(port, host, cb);
    })();

    this.logger.info(`server listening on ${host}:${port}`);
  }

  async close() {
    this.logger.verbose('closing server');

    await promisify((cb: (err?: Error) => void) => {
      this.server.close(cb);
    })();

    this.logger.info('server closed');
  }

  configure() {
    this.app.use(this.loggerMiddleware);

    this.app.get('/health-check', (req, res) => {
      res.status(200).end();
    });

    this.app.post('/game', async (req, res) => {
      const handler = this.container.resolve(TOKENS.commands.createGame);

      await handler.execute({ creatorId: '' });
      res.status(201).end();
    });

    const publisher = this.container.resolve(TOKENS.publisher);
    assert(publisher instanceof RealEventPublisherAdapter);

    publisher.register(GameCreatedEvent, async (event) => {
      const addPlayer = this.container.resolve(TOKENS.commands.addPlayer);

      await addPlayer.execute({
        gameId: event.entityId,
        playerId: event.creatorId,
      });
    });
  }

  private get loggerMiddleware() {
    const logger = this.logger;

    const format: morgan.FormatFn = (tokens, req, res) => {
      return [
        tokens['remote-addr'](req, res),
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
}
