import { createContainer, injectable } from 'ditox';

import { StubConfigAdapter } from './config/stub-config.adapter';
import { Server } from './server';
import { TOKENS } from './tokens';

describe('Server E2E', () => {
  it('plays a full game', async () => {
    const container = createContainer();

    const config = new StubConfigAdapter({
      server: { host: 'localhost', port: 7357 },
    });

    container.bindValue(TOKENS.config, config);

    container.bindFactory(
      TOKENS.server,
      injectable((config) => new Server(config), TOKENS.config)
    );

    const server = container.resolve(TOKENS.server);

    await server.listen();
    await server.close();
  });
});
