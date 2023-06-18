import { ConfigPort } from './config.port';

export class StubConfigAdapter implements ConfigPort {
  constructor(overrides: ConfigPort) {
    this.server = { ...this.server, ...overrides.server };
  }

  server = {
    host: 'localhost',
    port: 3000,
  };
}
