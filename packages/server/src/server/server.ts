import { createServer, Server as NodeServer } from 'http';
import { promisify } from 'util';

import express from 'express';
import morgan from 'morgan';

import { ConfigPort } from '../config/config.port';
import { LoggerPort } from '../logger/logger.port';

export class Server {
  private app: express.Express;
  private server: NodeServer;

  constructor(private readonly config: ConfigPort, private readonly logger: LoggerPort) {
    this.logger.context = 'Server';

    this.app = express();
    this.server = createServer(this.app);
    this.configure();
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
        write: logger.verbose.bind(logger),
      },
    });
  }
}
