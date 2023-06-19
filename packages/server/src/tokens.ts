import { Container, token } from 'ditox';

import { ConfigPort, EventPublisherPort, GeneratorPort, LoggerPort, RtcPort } from './adapters';
import { AuthenticateHandler } from './commands/authenticate/authenticate';
import { CreateGameHandler } from './commands/create-game/create-game';
import { JoinGameHandler } from './commands/join-game/join-game';
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
    joinGame: token<JoinGameHandler>('joinGame'),
  },

  queries: {
    getGame: token<GetGameHandler>('getGame'),
    getPlayer: token<GetPlayerHandler>('getPlayer'),
  },
};
