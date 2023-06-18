import assert from 'node:assert';

import { createContainer, injectableClass } from 'ditox';

import { StubConfigAdapter } from './config/stub-config.adapter';
import { CreateGameHandler } from './game/create-game/create-game';
import { StubGeneratorAdapter } from './generator/stub-generator.adapter';
import { StubLoggerAdapter } from './logger/stub-logger.adapter';
import { InMemoryGameRepository } from './persistence/repositories/game/in-memory-game.repository';
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
    this.container.bindValue(TOKENS.container, this.container);

    this.container.bindValue(TOKENS.config, this.config);
    this.container.bindValue(TOKENS.logger, this.logger);
    this.container.bindValue(TOKENS.generator, this.generator);

    this.container.bindFactory(
      TOKENS.server,
      injectableClass(Server, TOKENS.config, TOKENS.logger, TOKENS.container)
    );

    this.container.bindFactory(TOKENS.repositories.game, injectableClass(InMemoryGameRepository));

    this.container.bindFactory(
      TOKENS.commands.createGame,
      injectableClass(CreateGameHandler, TOKENS.generator, TOKENS.repositories.game)
    );
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
