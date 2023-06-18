import { StubConfigAdapter } from './config/stub-config.adapter';
import { Server } from './server';

describe('server', () => {
  it('starts a HTTP server', async () => {
    const config = new StubConfigAdapter({ server: { host: '0.0.0.0', port: 7357 } });
    const server = new Server(config);

    await server.listen();

    try {
      const response = await fetch('http://localhost:7357/health-check');
      expect(response.ok).toBe(true);
    } finally {
      await server.close();
    }

    await expect(fetch('http://localhost:7357/health-check')).rejects.toThrow('fetch failed');
  });
});
