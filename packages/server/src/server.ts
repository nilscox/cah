import { createServer, Server as NodeServer } from 'http';
import { promisify } from 'util';

import express from 'express';

import { ConfigPort } from './config/config.port';

export class Server {
  private app: express.Express;
  private server: NodeServer;

  constructor(private readonly config: ConfigPort) {
    this.app = express();
    this.server = createServer(this.app);
    this.configure();
  }

  async listen() {
    const { host, port } = this.config.server;

    await promisify((cb: () => void) => {
      this.server.listen(port, host, cb);
    })();
  }

  async close() {
    await promisify((cb: (err?: Error) => void) => {
      this.server.close(cb);
    })();
  }

  configure() {
    this.app.get('/health-check', (req, res) => {
      res.status(200).end();
    });
  }
}
