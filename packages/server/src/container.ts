import { createContainer, injectableClass } from 'ditox';

import { StubConfigAdapter } from './config/stub-config.adapter';
import { CreateGameHandler } from './game/create-game/create-game';
import { StubGeneratorAdapter } from './generator/stub-generator.adapter';
import { ConsoleLoggerAdapter } from './logger/console-logger.adapter';
import { InMemoryGameRepository } from './persistence/repositories/game/in-memory-game.repository';
import { Server } from './server/server';
import { TOKENS } from './tokens';

export const container = createContainer();

container.bindValue(TOKENS.container, container);

container.bindValue(TOKENS.config, new StubConfigAdapter());

container.bindFactory(TOKENS.logger, () => new ConsoleLoggerAdapter(), { scope: 'transient' });

container.bindFactory(TOKENS.generator, injectableClass(StubGeneratorAdapter));

container.bindFactory(TOKENS.server, injectableClass(Server, TOKENS.config, TOKENS.logger, TOKENS.container));

container.bindFactory(TOKENS.repositories.game, injectableClass(InMemoryGameRepository));

container.bindFactory(
  TOKENS.commands.createGame,
  injectableClass(CreateGameHandler, TOKENS.generator, TOKENS.repositories.game)
);
