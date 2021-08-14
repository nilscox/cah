import dotenv from 'dotenv';

import { Blank } from './domain/models/Blank';
import { createChoice } from './domain/models/Choice';
import { createQuestion } from './domain/models/Question';
import { instanciateDependencies } from './infrastructure';
import { Dependencies } from './infrastructure/Dependencies';
import { StubExternalData } from './infrastructure/stubs/StubExternalData';
import { createRoutes } from './infrastructure/web';
import { WebServer } from './infrastructure/web/web';
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
  const server = new WebServer();
  const deps = await instanciateDependencies({ websocketServer: server.websocketServer });

  if (process.env.NODE_ENV === 'development') {
    Object.assign(deps, overrideDependencies());
  }

  server.register(createRoutes(deps));

  await server.listen(deps.configService, deps.logger());
};

main().catch(console.error);
