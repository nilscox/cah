import dotenv from 'dotenv';

dotenv.config();

import { createKnexConnection, createKnexSessionStore, instanciateDependencies } from './infrastructure';
import { bootstrapServer } from './infrastructure/web';
import { WebsocketServer } from './infrastructure/web/websocket';

const main = async () => {
  const wss = new WebsocketServer();
  const sessionStore = await createKnexSessionStore(createKnexConnection());

  const deps = await instanciateDependencies({ wss });

  const server = await bootstrapServer(deps, wss, sessionStore);
  const logger = deps.logger();

  const port = Number(deps.configService.get('LISTEN_PORT') ?? '4242');
  const hostname = deps.configService.get('LISTEN_HOST') ?? 'localhost';

  if (isNaN(port) || port <= 0) {
    throw new Error(`LISTEN_PORT = "${port}" is not a positive integer`);
  }

  await new Promise<void>((resolve) => server.listen(port, hostname, resolve));

  logger.info(`server listening on ${hostname}:${port}`);
};

main().catch(console.error);
