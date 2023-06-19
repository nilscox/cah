import assert from 'node:assert';

import { bindModule, createContainer, injectableClass } from 'ditox';
import { Socket, io } from 'socket.io-client';

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
  constructor(private readonly baseUrl: string) {}

  post = this.mutate('POST');

  private mutate(method: string) {
    return async (path: string) => {
      const response = await fetch(this.baseUrl + path, { method });
      assert(response.ok);
    };
  }
}

class Client {
  private fetcher: Fetcher;
  private socket: Socket;

  constructor(private nick: string, server: Server) {
    const address = server.address;
    assert(address);

    this.fetcher = new Fetcher(`http://${address}`);
    this.socket = io(`ws://${address}`);

    this.socket.on('message', this.handleEvent);
  }

  public debug = false;

  private log(...args: unknown[]) {
    if (this.debug) {
      console.log(`* ${this.nick}`, ...args);
    }
  }

  private handleEvent = (event: unknown) => {
    this.log(event);
  };

  async createGame() {
    this.log('creates a game');
    await this.fetcher.post('/game');
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
    container.bindFactory(TOKENS.server, injectableClass(Server, TOKENS.config, TOKENS.logger, TOKENS.publisher, TOKENS.container));

    bindModule(container, inMemoryPersistenceModule);
    bindModule(container, appModule);
  }

  get server() {
    return this.container.resolve(TOKENS.server);
  }

  createClient(nick: string) {
    return new Client(nick, this.server);
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
    const client = test.createClient('riri');
    // client.debug = true;

    await client.createGame();
  });
});
