import { ConfigPort } from './config.port';

export class EnvConfigAdapter implements ConfigPort {
  server: ConfigPort['server'];
  database: ConfigPort['database'];

  constructor() {
    this.server = {
      host: this.getEnv('HOST', String, 'localhost'),
      port: this.getEnv('PORT', parseInt, 3000),
    };

    this.database = {
      url: this.getEnv('DATABASE_URL', String, 'postgres://postgres@localhost:5432/cah'),
      debug: this.getEnv('DATABASE_DEBUG', (value) => value === 'true', false),
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
}
