import { token } from 'ditox';

import { ConfigPort } from './config/config.port';
import { LoggerPort } from './logger/logger.port';
import { Server } from './server/server';

export const TOKENS = {
  config: token<ConfigPort>('config'),
  logger: token<LoggerPort>('logger'),
  server: token<Server>('server'),
};
