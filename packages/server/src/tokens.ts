import { Container, token } from 'ditox';

import { ConfigPort } from './config/config.port';
import { CreateGameHandler } from './game/create-game/create-game';
import { GeneratorPort } from './generator/generator.port';
import { LoggerPort } from './logger/logger.port';
import { GameRepository } from './persistence/repositories/game/game.repository';
import { Server } from './server/server';

export const TOKENS = {
  container: token<Container>('container'),

  config: token<ConfigPort>('config'),
  logger: token<LoggerPort>('logger'),
  server: token<Server>('server'),
  generator: token<GeneratorPort>('generator'),

  repositories: {
    game: token<GameRepository>('gameRepository'),
  },

  commands: {
    createGame: token<CreateGameHandler>('createGame'),
  },
};
