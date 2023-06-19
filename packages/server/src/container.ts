import { bindModule, createContainer, declareModule, injectableClass } from 'ditox';

import {
  StubConfigAdapter,
  RealEventPublisherAdapter,
  StubGeneratorAdapter,
  ConsoleLoggerAdapter,
} from 'src/adapters';
import {
  GameRepository,
  InMemoryGameRepository,
  InMemoryPlayerRepository,
  PlayerRepository,
} from 'src/persistence';

import { AddPlayerHandler } from './commands/game/add-player/add-player';
import { CreateGameHandler } from './commands/game/create-game/create-game';
import { Server } from './server/server';
import { TOKENS } from './tokens';

type PersistenceModule = {
  gameRepository: GameRepository;
  playerRepository: PlayerRepository;
};

export const inMemoryPersistenceModule = declareModule<PersistenceModule>({
  factory: () => ({
    gameRepository: new InMemoryGameRepository(),
    playerRepository: new InMemoryPlayerRepository(),
  }),
  exports: {
    gameRepository: TOKENS.repositories.game,
    playerRepository: TOKENS.repositories.player,
  },
});

type AppModule = {
  createGame: CreateGameHandler;
  addPlayer: AddPlayerHandler;
};

export const appModule = declareModule<AppModule>({
  factory: (container) => {
    const { generator, publisher, repositories } = TOKENS;
    const { game: gameRepository, player: playerRepository } = repositories;

    return {
      createGame: injectableClass(CreateGameHandler, generator, publisher, gameRepository)(container),
      addPlayer: injectableClass(AddPlayerHandler, publisher, gameRepository, playerRepository)(container),
    };
  },
  exports: {
    createGame: TOKENS.commands.createGame,
    addPlayer: TOKENS.commands.addPlayer,
  },
});

export const container = createContainer();

container.bindValue(TOKENS.container, container);

container.bindValue(TOKENS.config, new StubConfigAdapter());
container.bindFactory(TOKENS.logger, () => new ConsoleLoggerAdapter(), { scope: 'transient' });
container.bindFactory(TOKENS.generator, injectableClass(StubGeneratorAdapter));

container.bindFactory(TOKENS.publisher, injectableClass(RealEventPublisherAdapter, TOKENS.logger));
container.bindFactory(TOKENS.server, injectableClass(Server, TOKENS.config, TOKENS.logger, TOKENS.container));

bindModule(container, inMemoryPersistenceModule);
bindModule(container, appModule);
