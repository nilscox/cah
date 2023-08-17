import { assert } from '@cah/utils';
import { injectableClass } from 'ditox';

import { ConfigPort } from './config.port';

export class EnvConfigAdapter implements ConfigPort {
  static inject = injectableClass(this);

  server: ConfigPort['server'];
  data: ConfigPort['data'];
  database: ConfigPort['database'];
  session: ConfigPort['session'];

  constructor() {
    this.server = {
      host: this.getEnv('HOST', String, 'localhost'),
      port: this.getEnv('PORT', parseInt, 3000),
    };

    this.data = {
      path: this.getEnv('DATA_DIR', String, './data'),
    };

    this.database = {
      url: this.getEnv('DATABASE_URL', String, 'postgres://postgres@localhost:5432/cah'),
      debug: this.getEnv('DATABASE_DEBUG', (value) => value === 'true', false),
    };

    this.session = {
      secret: this.getEnv('SESSION_SECRET', String, ''),
      store: this.getEnv('SESSION_STORE', this.parseSessionStore, 'database'),
    };
  }

  private getEnv<T>(key: string, parse: (value: string) => T, defaultValue?: T): T {
    const env = process.env[key];

    if (env === undefined) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }

      throw new Error(`Missing environment variable "${key}"`);
    }

    return parse(env);
  }

  private parseSessionStore(this: void, value: string) {
    assert(value === 'memory' || value === 'database', 'SESSION_STORE must be either "memory" or "database"');
    return value;
  }
}
