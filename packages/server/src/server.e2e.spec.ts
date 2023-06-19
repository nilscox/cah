import assert from 'node:assert';

import { bindModule, createContainer, injectableClass } from 'ditox';

import {
  StubConfigAdapter,
  RealEventPublisherAdapter,
  StubGeneratorAdapter,
  StubLoggerAdapter,
} from './adapters';
import { appModule, inMemoryPersistenceModule } from './container';
import { Server } from './server/server';
import { TOKENS } from './tokens';

class Fetcher {
  constructor(private server: Server) {}

  post = this.mutate('POST');

  private mutate(method: string) {
    return async (path: string) => {
      const url = this.server.url;
      assert(url);

      const response = await fetch(url + path, { method });
      assert(response.ok);
    };
  }
}

class Test {
  private container = createContainer();

  config = new StubConfigAdapter({ server: { host: 'localhost', port: 0 } });
  logger = new StubLoggerAdapter();
  generator = new StubGeneratorAdapter();

  constructor() {
    const container = this.container;

    container.bindValue(TOKENS.container, container);

    container.bindValue(TOKENS.config, this.config);
    container.bindValue(TOKENS.logger, this.logger);
    container.bindValue(TOKENS.generator, this.generator);

    container.bindFactory(TOKENS.publisher, injectableClass(RealEventPublisherAdapter, TOKENS.logger));
    // prettier-ignore
    container.bindFactory(TOKENS.server, injectableClass(Server, TOKENS.config, TOKENS.logger, TOKENS.container));

    bindModule(container, inMemoryPersistenceModule);
    bindModule(container, appModule);
  }

  get server() {
    return this.container.resolve(TOKENS.server);
  }

  createClient() {
    return new Fetcher(this.server);
  }
}

describe('Server E2E', () => {
  let test: Test;

  beforeEach(async () => {
    test = new Test();
    await test.server.listen();
  });

  afterEach(async () => {
    await test.server.close();
  });

  it('plays a full game', async () => {
    const client = test.createClient();

    await client.post('/game');
  });
});
