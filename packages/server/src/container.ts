import { createContainer, injectableClass } from 'ditox';

import { StubConfigAdapter } from './config/stub-config.adapter';
import { ConsoleLoggerAdapter } from './logger/console-logger.adapter';
import { Server } from './server/server';
import { TOKENS } from './tokens';

export const container = createContainer();

container.bindValue(TOKENS.config, new StubConfigAdapter());

container.bindFactory(TOKENS.logger, () => new ConsoleLoggerAdapter(), { scope: 'transient' });

container.bindFactory(TOKENS.server, injectableClass(Server, TOKENS.config, TOKENS.logger));
