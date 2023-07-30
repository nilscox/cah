import { CahClient, ServerFetcher } from '@cah/client';
import { defined, waitFor } from '@cah/utils';
import { bindModule } from 'ditox';

import { StubConfigAdapter, StubEventPublisherAdapter, StubLoggerAdapter } from 'src/adapters';
import { createContainer } from 'src/container';
import { inMemoryPersistenceModule } from 'src/persistence';
import { TOKENS } from 'src/tokens';

import { Server } from './server';
import { PlayerConnectedEvent, PlayerDisconnectedEvent } from './ws-server';

class Test {
  container = createContainer();

  config = new StubConfigAdapter({ server: { host: '0.0.0.0', port: 7357 } });
  logger = new StubLoggerAdapter();
  publisher = new StubEventPublisherAdapter();

  server: Server;

  constructor() {
    bindModule(this.container, inMemoryPersistenceModule);

    this.server = new Server(
      this.config,
      this.logger,
      this.publisher,
      this.container.resolve(TOKENS.repositories.player),
      this.container,
    );
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
    await test.cleanup();
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

  it('triggers a events when the player connects and disconnects', async () => {
    await test.server.listen();

    const client = new CahClient(new ServerFetcher(`http://${test.server.address}`));

    await client.authenticate('nick');
    const player = await client.getAuthenticatedPlayer();

    await client.connect();
    await waitFor(() => expect(test.publisher).toContainEqual(new PlayerConnectedEvent(player.id)));

    await client.disconnect();
    await waitFor(() => expect(test.publisher).toContainEqual(new PlayerDisconnectedEvent(player.id)));
  });
});
