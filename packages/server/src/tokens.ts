import { token } from 'ditox';

import { ConfigPort } from './config/config.port';
import { Server } from './server';

export const TOKENS = {
  config: token<ConfigPort>('config'),
  server: token<Server>('server'),
};
