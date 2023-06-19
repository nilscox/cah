import { bindModule, createContainer, declareModule, injectable, injectableClass } from 'ditox';

import { ConsoleLoggerAdapter, RealEventPublisherAdapter, StubConfigAdapter } from 'src/adapters';
import {
  GameRepository,
  InMemoryGameRepository,
  InMemoryPlayerRepository,
  PlayerRepository,
} from 'src/persistence';

import { MathRandomGeneratorAdapter } from './adapters/generator/math-random-generator.adapter';
import { AddPlayerHandler } from './commands/game/add-player/add-player';
import { CreateGameHandler } from './commands/game/create-game/create-game';
import { AuthenticateHandler } from './commands/player/authenticate/authenticate';
import { Notifier } from './notifier/notifier';
import { GetGameHandler } from './queries/get-game';
import { GetPlayerHandler } from './queries/get-player';
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
  authenticate: AuthenticateHandler;
  createGame: CreateGameHandler;
  addPlayer: AddPlayerHandler;
  getGame: GetGameHandler;
  getPlayer: GetPlayerHandler;
};

export const appModule = declareModule<AppModule>({
  factory: (container) => {
    const { generator, publisher, repositories } = TOKENS;
    const { game: gameRepository, player: playerRepository } = repositories;

    return {
      authenticate: injectableClass(AuthenticateHandler, generator, publisher, playerRepository)(container),
      createGame: injectableClass(CreateGameHandler, generator, publisher, gameRepository)(container),
      addPlayer: injectableClass(AddPlayerHandler, publisher, gameRepository, playerRepository)(container),
      getGame: injectableClass(GetGameHandler, gameRepository)(container),
      getPlayer: injectableClass(GetPlayerHandler, playerRepository)(container),
    };
  },
  exports: {
    authenticate: TOKENS.commands.authenticate,
    createGame: TOKENS.commands.createGame,
    addPlayer: TOKENS.commands.addPlayer,
    getGame: TOKENS.queries.getGame,
    getPlayer: TOKENS.queries.getPlayer,
  },
});

export const container = createContainer();

container.bindValue(TOKENS.container, container);

container.bindValue(TOKENS.config, new StubConfigAdapter());
container.bindFactory(TOKENS.logger, () => new ConsoleLoggerAdapter(), { scope: 'transient' });
container.bindFactory(TOKENS.generator, injectableClass(MathRandomGeneratorAdapter));

// prettier-ignore
{
  container.bindFactory(TOKENS.publisher, injectableClass(RealEventPublisherAdapter, TOKENS.logger));
  container.bindFactory(TOKENS.server, injectableClass(Server, TOKENS.config, TOKENS.logger, TOKENS.publisher, TOKENS.container));
  container.bindFactory(TOKENS.rtc, injectable((server) => server.rtc, TOKENS.server));
  container.bindFactory(TOKENS.notifier, injectableClass(Notifier, TOKENS.rtc, TOKENS.publisher, TOKENS.repositories.game, TOKENS.repositories.player));
}

bindModule(container, inMemoryPersistenceModule);
bindModule(container, appModule);
