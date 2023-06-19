import { Container, token } from 'ditox';

import { ConfigPort, EventPublisherPort, GeneratorPort, LoggerPort } from './adapters';
import { AddPlayerHandler } from './commands/game/add-player/add-player';
import { CreateGameHandler } from './commands/game/create-game/create-game';
import { GameRepository } from './persistence/repositories/game/game.repository';
import { PlayerRepository } from './persistence/repositories/player/player.repository';
import { Server } from './server/server';

export const TOKENS = {
  container: token<Container>('container'),

  config: token<ConfigPort>('config'),
  logger: token<LoggerPort>('logger'),
  server: token<Server>('server'),
  generator: token<GeneratorPort>('generator'),
  publisher: token<EventPublisherPort>('publisher'),

  repositories: {
    game: token<GameRepository>('gameRepository'),
    player: token<PlayerRepository>('playerRepository'),
  },

  commands: {
    createGame: token<CreateGameHandler>('createGame'),
    addPlayer: token<AddPlayerHandler>('addPlayer'),
  },
};
