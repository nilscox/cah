import { createContainer, injectableClass } from 'ditox';

import { AddPlayerHandler } from './commands/game/add-player/add-player';
import { CreateGameHandler } from './commands/game/create-game/create-game';
import { StubConfigAdapter } from './config/stub-config.adapter';
import { RealEventPublisherAdapter } from './event-publisher/real-event-publisher.adapter';
import { StubGeneratorAdapter } from './generator/stub-generator.adapter';
import { ConsoleLoggerAdapter } from './logger/console-logger.adapter';
import { InMemoryGameRepository } from './persistence/repositories/game/in-memory-game.repository';
import { InMemoryPlayerRepository } from './persistence/repositories/player/in-memory-player.repository';
import { Server } from './server/server';
import { TOKENS } from './tokens';

export const container = createContainer();

container.bindValue(TOKENS.container, container);

container.bindValue(TOKENS.config, new StubConfigAdapter());

container.bindFactory(TOKENS.logger, () => new ConsoleLoggerAdapter(), { scope: 'transient' });

container.bindFactory(TOKENS.generator, injectableClass(StubGeneratorAdapter));

container.bindFactory(TOKENS.publisher, injectableClass(RealEventPublisherAdapter, TOKENS.logger));

container.bindFactory(TOKENS.server, injectableClass(Server, TOKENS.config, TOKENS.logger, TOKENS.container));

container.bindFactory(TOKENS.repositories.game, injectableClass(InMemoryGameRepository));
container.bindFactory(TOKENS.repositories.player, injectableClass(InMemoryPlayerRepository));

container.bindFactory(
  TOKENS.commands.createGame,
  injectableClass(CreateGameHandler, TOKENS.generator, TOKENS.publisher, TOKENS.repositories.game)
);

container.bindFactory(
  TOKENS.commands.addPlayer,
  injectableClass(AddPlayerHandler, TOKENS.publisher, TOKENS.repositories.game, TOKENS.repositories.player)
);
