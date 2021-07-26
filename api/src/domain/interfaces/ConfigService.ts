const configurationVariables = [
  // Env

  'LISTEN_IP',
  'LISTEN_PORT',

  'LOG_LEVEL',
  'REFLECT_ORIGIN',

  // Database

  'DB_FILE',
  'DB_LOGS',

  // Session

  'SESSION_SECRET',

  // Game

  'GAME_CODE',
] as const;

export type ConfigurationVariable = typeof configurationVariables[number];

export interface ConfigService {
  get(key: ConfigurationVariable): string | undefined;
}
