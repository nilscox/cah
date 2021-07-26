import { ConfigService, ConfigurationVariable } from '../../domain/interfaces/ConfigService';

export class StubConfigService implements ConfigService {
  env: Partial<Record<ConfigurationVariable, string>> = {};

  get(key: ConfigurationVariable) {
    return this.env[key];
  }

  set(key: ConfigurationVariable, value: string) {
    this.env[key] = value;
  }
}
