import { ConfigPort } from './config.port';

export class StubConfigAdapter implements ConfigPort {
  constructor(overrides?: Partial<ConfigPort>) {
    this.server = { ...this.server, ...overrides?.server };
    this.database = { ...this.database, ...overrides?.database };
  }

  server: ConfigPort['server'] = {
    host: 'localhost',
    port: 3000,
  };

  data: ConfigPort['data'] = {
    path: '',
  };

  database: ConfigPort['database'] = {
    url: '',
    debug: false,
  };

  session: ConfigPort['session'] = {
    secret: '',
    store: 'memory',
  };
}
