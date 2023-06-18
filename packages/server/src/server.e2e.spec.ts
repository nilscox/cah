import { createContainer, injectableClass } from 'ditox';

import { StubConfigAdapter } from './config/stub-config.adapter';
import { StubLoggerAdapter } from './logger/stub-logger.adapter';
import { Server } from './server';
import { TOKENS } from './tokens';

describe('Server E2E', () => {
  it('plays a full game', async () => {
    const container = createContainer();

    const config = new StubConfigAdapter({
      server: { host: 'localhost', port: 7357 },
    });

    const logger = new StubLoggerAdapter();

    container.bindValue(TOKENS.config, config);
    container.bindValue(TOKENS.logger, logger);

    container.bindFactory(TOKENS.server, injectableClass(Server, TOKENS.config, TOKENS.logger));

    const server = container.resolve(TOKENS.server);

    await server.listen();
    await server.close();
  });
});
