import assert from 'node:assert';

import { createContainer, injectableClass } from 'ditox';

import { AddPlayerHandler } from './commands/game/add-player/add-player';
import { CreateGameHandler } from './commands/game/create-game/create-game';
import { StubConfigAdapter } from './config/stub-config.adapter';
import { RealEventPublisherAdapter } from './event-publisher/real-event-publisher.adapter';
import { StubGeneratorAdapter } from './generator/stub-generator.adapter';
import { StubLoggerAdapter } from './logger/stub-logger.adapter';
import { InMemoryGameRepository } from './persistence/repositories/game/in-memory-game.repository';
import { InMemoryPlayerRepository } from './persistence/repositories/player/in-memory-player.repository';
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

    container.bindFactory(
      TOKENS.server,
      injectableClass(Server, TOKENS.config, TOKENS.logger, TOKENS.container)
    );

    container.bindFactory(TOKENS.repositories.game, injectableClass(InMemoryGameRepository));
    container.bindFactory(TOKENS.repositories.player, injectableClass(InMemoryPlayerRepository));

    container.bindFactory(
      TOKENS.commands.createGame,
      injectableClass(CreateGameHandler, TOKENS.generator, TOKENS.publisher, TOKENS.repositories.game)
    );

    container.bindFactory(
      TOKENS.commands.addPlayer,
      injectableClass(
        AddPlayerHandler,
        TOKENS.publisher,
        TOKENS.repositories.game,
        TOKENS.repositories.player
      )
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
