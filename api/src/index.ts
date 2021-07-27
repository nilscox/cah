import dotenv from 'dotenv';

dotenv.config();

import { createKnexConnection, createKnexSessionStore, main } from './infrastructure';
import { bootstrapServer } from './infrastructure/web';
import { WebsocketServer } from './infrastructure/web/websocket';

const hostname = process.env.HOST ?? '0.0.0.0';
const port = Number.parseInt(process.env.PORT ?? '4242');

const start = async () => {
  const deps = await main();

  const wss = new WebsocketServer();
  const sessionStore = await createKnexSessionStore(createKnexConnection());

  const server = await bootstrapServer(deps, wss, sessionStore);

  if (isNaN(port) || port <= 0) {
    throw new Error(`process.env.PORT = "${port}" is not a positive integer`);
  }

  await new Promise<void>((resolve) => server.listen(port, hostname, resolve));

  console.info(`server started on port ${port}`);
};

start().catch(console.error);
