import { Container, token } from 'ditox';

import { ConfigPort, EventPublisherPort, GeneratorPort, LoggerPort, RtcPort } from './adapters';
import { AddPlayerHandler } from './commands/game/add-player/add-player';
import { CreateGameHandler } from './commands/game/create-game/create-game';
import { AuthenticateHandler } from './commands/player/authenticate/authenticate';
import { Notifier } from './notifier/notifier';
import { GameRepository, PlayerRepository } from './persistence';
import { GetGameHandler } from './queries/get-game';
import { GetPlayerHandler } from './queries/get-player';
import { Server } from './server/server';

export const TOKENS = {
  container: token<Container>('container'),

  config: token<ConfigPort>('config'),
  logger: token<LoggerPort>('logger'),
  generator: token<GeneratorPort>('generator'),

  publisher: token<EventPublisherPort>('publisher'),
  server: token<Server>('server'),
  rtc: token<RtcPort>('rtc'),
  notifier: token<Notifier>('notifier'),

  repositories: {
    game: token<GameRepository>('gameRepository'),
    player: token<PlayerRepository>('playerRepository'),
  },

  commands: {
    authenticate: token<AuthenticateHandler>('authenticate'),
    createGame: token<CreateGameHandler>('createGame'),
    addPlayer: token<AddPlayerHandler>('addPlayer'),
  },

  queries: {
    getGame: token<GetGameHandler>('getGame'),
    getPlayer: token<GetPlayerHandler>('getPlayer'),
  },
};
