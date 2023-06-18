import { createContainer, injectable } from 'ditox';

import { StubConfigAdapter } from './config/stub-config.adapter';
import { Server } from './server';
import { TOKENS } from './tokens';

export const container = createContainer();

container.bindValue(TOKENS.config, new StubConfigAdapter());

container.bindFactory(
  TOKENS.server,
  injectable((config) => new Server(config), TOKENS.config)
);
