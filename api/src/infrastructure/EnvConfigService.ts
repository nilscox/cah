import { ConfigService, ConfigurationVariable } from '../domain/interfaces/ConfigService';

export class EnvConfigService implements ConfigService {
  get(key: ConfigurationVariable) {
    return process.env[key];
  }
}
