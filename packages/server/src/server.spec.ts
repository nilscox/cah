import { StubConfigAdapter } from './config/stub-config.adapter';
import { StubLoggerAdapter } from './logger/stub-logger.adapter';
import { Server } from './server';

describe('server', () => {
  it('starts a HTTP server', async () => {
    const config = new StubConfigAdapter({ server: { host: '0.0.0.0', port: 7357 } });
    const logger = new StubLoggerAdapter();

    const server = new Server(config, logger);

    await server.listen();

    try {
      const response = await fetch('http://localhost:7357/health-check');
      expect(response.ok).toBe(true);
    } finally {
      await server.close();
    }

    await expect(fetch('http://localhost:7357/health-check')).rejects.toThrow('fetch failed');
  });

  it('logs some messages when the server starts and closes', async () => {
    const config = new StubConfigAdapter({ server: { host: '0.0.0.0', port: 7357 } });
    const logger = new StubLoggerAdapter();

    const server = new Server(config, logger);

    await server.listen();
    expect(logger.logs.get('info')).toContainEqual(['server listening on 0.0.0.0:7357']);

    await server.close();
    expect(logger.logs.get('verbose')).toContainEqual(['closing server']);
    expect(logger.logs.get('info')).toContainEqual(['server closed']);
  });
});
