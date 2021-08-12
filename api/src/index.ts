import dotenv from 'dotenv';
import { createConnection } from 'typeorm';

import { Blank } from './domain/models/Blank';
import { createChoice } from './domain/models/Choice';
import { createQuestion } from './domain/models/Question';
import { createKnexConnection, createKnexSessionStore, instanciateDependencies } from './infrastructure';
import { Dependencies } from './infrastructure/Dependencies';
import { StubExternalData } from './infrastructure/stubs/StubExternalData';
import { bootstrapServer } from './infrastructure/web';
import { WebsocketServer } from './infrastructure/web/websocket';
import { array } from './utils/array';

dotenv.config();

const overrideDependencies = (): Partial<Dependencies> => {
  const externalData = new StubExternalData();

  externalData.setRandomQuestions(array(100, () => createQuestion({ text: `Question: ?`, blanks: [new Blank(10)] })));
  externalData.setRandomChoices(array(100, (n) => createChoice(`Choice ${n}`, { caseSensitive: n % 4 === 0 })));

  return {
    externalData,
  };
};

const main = async () => {
  const wss = new WebsocketServer();
  const sessionStore = await createKnexSessionStore(createKnexConnection());

  const deps = await instanciateDependencies({ connection: await createConnection(), wss });

  if (process.env.NODE_ENV === 'development') {
    Object.assign(deps, overrideDependencies());
  }

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
