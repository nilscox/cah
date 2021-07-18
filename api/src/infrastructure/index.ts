import { ErrorRequestHandler, Request } from 'express';
import { Connection } from 'typeorm';

import { CreateAnswerCommand, CreateAnswerHandler } from '../application/commands/CreateAnswerCommand';
import { CreateGameCommand, CreateGameHandler } from '../application/commands/CreateGameCommand';
import { JoinGameCommand, JoinGameHandler } from '../application/commands/JoinGameCommand';
import { LoginCommand, LoginHandler } from '../application/commands/LoginCommand';
import { NextTurnHandler } from '../application/commands/NextTurnCommand';
import { SelectWinnerCommand, SelectWinnerHandler } from '../application/commands/SelectWinnerCommand';
import { StartGameCommand, StartGameHandler } from '../application/commands/StartGameCommand';
import { GameEventsHandler } from '../application/handlers/GameEventsHandler';
import { PlayerEventsHandler } from '../application/handlers/PlayerEventsHandler';
import { SessionStore } from '../application/interfaces/SessionStore';
import { GetGameHandler, GetGameQuery } from '../application/queries/GetGameQuery';
import { GetPlayerHandler } from '../application/queries/GetPlayerQuery';
import { GameService } from '../application/services/GameService';
import { RandomService } from '../application/services/RandomService';
import { PlayerRepository } from '../domain/interfaces/PlayerRepository';
import { Player } from '../domain/models/Player';

import { InMemoryGameRepository } from './database/repositories/game/InMemoryGameRepository';
import { SQLGameRepository } from './database/repositories/game/SQLGameRepository';
import { InMemoryPlayerRepository } from './database/repositories/player/InMemoryPlayerRepository';
import { SQLPlayerRepository } from './database/repositories/player/SQLPlayerRepository';
import { FilesystemExternalData } from './FilesystemExternalData';
import { PubSub } from './PubSub';
import { context, dto, errorHandler, guard, handler, middleware, status } from './web/middlewaresCreators';
import { FallbackRoute, InputDto, Route } from './web/Route';
import { createServer } from './web/web';
import { WebsocketRTCManager } from './web/websocket';

declare module 'express-session' {
  export interface SessionData {
    playerId: string;
  }
}

declare module 'express-serve-static-core' {
  export interface Request {
    input?: InputDto;
    player?: Player;
    context?: SessionStore;
  }
}

class PlayerProvider {
  constructor(private readonly playerRepository: PlayerRepository) {}

  async execute(req: Request) {
    if (req.session.playerId) {
      req.player = await this.playerRepository.findPlayerById(req.session.playerId);
    }
  }
}

class ExpressSessionStore implements SessionStore {
  constructor(private readonly request: Request) {}

  get player(): Player | undefined {
    return this.request.player;
  }

  set player(player: Player | undefined) {
    this.request.player = player;
    this.request.session.playerId = player?.id;
  }
}

class ErrorHandler {
  execute: ErrorRequestHandler = (error, req, res) => {
    const { status, message, ...err } = error;

    console.log(error);
    res.status(status ?? 500);

    return {
      message,
      ...err,
    };
  };
}

const isAuthenticated = (req: Request) => {
  if (req.session.playerId === undefined) {
    return 'you must be authenticated';
  }
};

const isNotAuthenticated = (req: Request) => {
  if (!isAuthenticated(req)) {
    return 'you must not be authenticated';
  }
};

export type Config = {
  connection?: Connection;
  dataDir: string;
};

export const bootstrapServer = async (config: Config) => {
  const { connection, dataDir } = config;

  const playerRepository = connection ? new SQLPlayerRepository(connection) : new InMemoryPlayerRepository();
  const gameRepository = connection ? new SQLGameRepository(connection) : new InMemoryGameRepository();

  const publisher = new PubSub();
  const gameService = new GameService(playerRepository, gameRepository, publisher);
  const randomService = new RandomService();
  const externalData = new FilesystemExternalData(dataDir, randomService);
  const rtcManager = new WebsocketRTCManager();

  const gameEventsHandler = new GameEventsHandler(rtcManager);
  const playerEventsHandler = new PlayerEventsHandler(rtcManager);

  publisher.subscribe(gameEventsHandler);
  publisher.subscribe(playerEventsHandler);

  const playerContext = [
    middleware(new PlayerProvider(playerRepository)),
    context((req) => new ExpressSessionStore(req)),
  ];

  const authPlayerContext = [...playerContext, guard(isAuthenticated)];

  // prettier-ignore
  const routes = [
    new Route('post', '/login')
      .use(...playerContext)
      .use(guard(isNotAuthenticated))
      .use(dto(({ body }) => new LoginCommand(body.nick)))
      .use(status(201))
      .use(handler(new LoginHandler(playerRepository))),

    new Route('get', '/player/me')
      .use(...authPlayerContext)
      .use(dto((req) => ({ playerId: req.session.playerId })))
      .use(handler(new GetPlayerHandler(playerRepository, gameRepository))),

    new Route('get', '/player/:playerId')
      .use(...playerContext)
      .use(dto((req) => ({ playerId: req.params.playerId })))
      .use(handler(new GetPlayerHandler(playerRepository, gameRepository))),

    new Route('get', '/game/:gameId')
      .use(...authPlayerContext)
      .use(dto((req) => new GetGameQuery(req.params.gameId)))
      .use(handler(new GetGameHandler(gameService, rtcManager))),

    new Route('post', '/game')
      .use(...authPlayerContext)
      .use(dto(() => new CreateGameCommand()))
      .use(status(201))
      .use(handler(new CreateGameHandler(gameService, gameRepository, rtcManager))),

    new Route('post', '/game/:gameId/join')
      .use(...authPlayerContext)
      .use(dto((req) => new JoinGameCommand(req.params.gameId)))
      .use(handler(new JoinGameHandler(gameService, gameRepository, rtcManager))),

    new Route('post', '/start')
      .use(...authPlayerContext)
      .use(dto(({ body }) => new StartGameCommand(body.questionMasterId, body.turns)))
      .use(handler(new StartGameHandler(gameService, gameRepository, externalData))),

    new Route('post', '/answer')
      .use(...authPlayerContext)
      .use(dto(({ body }) => new CreateAnswerCommand(body.choicesIds)))
      .use(handler(new CreateAnswerHandler(gameService, randomService))),

    new Route('post', '/select')
      .use(...authPlayerContext)
      .use(dto(({ body }) => new SelectWinnerCommand(body.answerId)))
      .use(handler(new SelectWinnerHandler(gameService))),

    new Route('post', '/next')
      .use(...authPlayerContext)
      .use(handler(new NextTurnHandler(gameService, gameRepository))),

    new FallbackRoute()
      .use(errorHandler(new ErrorHandler()))
      .use((req, res) => res.status(404).end()),
  ];

  const [_app, server, wss] = createServer(routes);

  rtcManager.wss = wss;

  return server;
};
