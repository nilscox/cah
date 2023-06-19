import { Container, token } from 'ditox';

import { ConfigPort, EventPublisherPort, GeneratorPort, LoggerPort } from './adapters';
import { AddPlayerHandler } from './commands/game/add-player/add-player';
import { CreateGameHandler } from './commands/game/create-game/create-game';
import { AuthenticateHandler } from './commands/player/authenticate/authenticate';
import { GameRepository, PlayerRepository } from './persistence';
import { Server } from './server/server';

export const TOKENS = {
  container: token<Container>('container'),

  config: token<ConfigPort>('config'),
  logger: token<LoggerPort>('logger'),
  generator: token<GeneratorPort>('generator'),

  publisher: token<EventPublisherPort>('publisher'),
  server: token<Server>('server'),

  repositories: {
    game: token<GameRepository>('gameRepository'),
    player: token<PlayerRepository>('playerRepository'),
  },

  commands: {
    authenticate: token<AuthenticateHandler>('authenticate'),
    createGame: token<CreateGameHandler>('createGame'),
    addPlayer: token<AddPlayerHandler>('addPlayer'),
  },
};
