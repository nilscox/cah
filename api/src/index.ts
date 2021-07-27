import dotenv from 'dotenv';

dotenv.config();

import { createKnexConnection, createKnexSessionStore, main } from './infrastructure';
import { bootstrapServer } from './infrastructure/web';
import { WebsocketServer } from './infrastructure/web/websocket';

const start = async () => {
  const wss = new WebsocketServer();
  const sessionStore = await createKnexSessionStore(createKnexConnection());

  const deps = await main({ wss });

  const logger = deps.logger();

  try {
    const server = await bootstrapServer(deps, wss, sessionStore);

    const port = Number(deps.configService.get('LISTEN_PORT') ?? '4242');
    const hostname = deps.configService.get('LISTEN_HOST') ?? 'localhost';

    if (isNaN(port) || port <= 0) {
      throw new Error(`LISTEN_PORT = "${port}" is not a positive integer`);
    }

    await new Promise<void>((resolve) => server.listen(port, hostname, resolve));

    logger.info(`server listening on ${hostname}:${port}`);
  } catch (error) {
    logger.error(error);
  }
};

start().catch(console.error);
