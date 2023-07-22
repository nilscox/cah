import { bindModule } from 'ditox';
import { io } from 'socket.io-client';

import { StubConfigAdapter, StubEventPublisherAdapter, StubLoggerAdapter } from 'src/adapters';
import { createContainer } from 'src/container';
import { Player } from 'src/entities';
import { inMemoryPersistenceModule } from 'src/persistence';
import { defined } from 'src/utils/defined';
import { Fetcher } from 'src/utils/fetcher';

import { Server } from './server';
import { PlayerConnectedEvent, PlayerDisconnectedEvent } from './ws-server';

class Test {
  container = createContainer();

  config = new StubConfigAdapter({ server: { host: '0.0.0.0', port: 7357 } });
  logger = new StubLoggerAdapter();
  publisher = new StubEventPublisherAdapter();

  server = new Server(this.config, this.logger, this.publisher, this.container);

  constructor() {
    bindModule(this.container, inMemoryPersistenceModule);
  }

  async cleanup() {
    await this.server.close();
  }

  get address() {
    return defined(this.server.address);
  }
}

describe('server', () => {
  let test: Test;

  beforeEach(() => {
    test = new Test();
  });

  afterEach(async () => {
    if (test.server.listening) {
      await test.server.close();
    }
  });

  it('starts a HTTP server', async () => {
    await test.server.listen();

    try {
      const response = await fetch('http://localhost:7357/health-check');
      expect(response.ok).toBe(true);
    } finally {
      await test.server.close();
    }

    await expect(fetch('http://localhost:7357/health-check')).rejects.toThrow('fetch failed');
  });

  it('logs some messages when the server starts and closes', async () => {
    await test.server.listen();
    expect(test.logger.logs.get('info')).toContainEqual(['server listening on 0.0.0.0:7357']);

    await test.server.close();
    expect(test.logger.logs.get('verbose')).toContainEqual(['closing server']);
    expect(test.logger.logs.get('info')).toContainEqual(['server closed']);
  });

  it('triggers a PlayerConnectedEvent', async () => {
    await test.server.listen();

    const fetcher = new Fetcher(`http://${String(test.server.address)}`);

    await fetcher.post('/authenticate', { nick: 'nick' });
    const { id: playerId } = await fetcher.get<Player>('/player');

    const socket = io(`ws://${defined(test.server.address)}`, {
      extraHeaders: { cookie: fetcher.cookie },
    });

    await new Promise<void>((resolve) => socket.on('connect', resolve));

    expect(test.publisher).toContainEqual(new PlayerConnectedEvent(playerId));

    socket.disconnect();
    await new Promise((r) => setTimeout(r, 10));

    expect(test.publisher).toContainEqual(new PlayerDisconnectedEvent(playerId));
  });
});
