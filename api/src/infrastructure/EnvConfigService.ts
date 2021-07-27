import { ConfigService, ConfigurationVariable } from '../application/interfaces/ConfigService';

export class EnvConfigService implements ConfigService {
  get(key: ConfigurationVariable) {
    return process.env[key];
  }
}
