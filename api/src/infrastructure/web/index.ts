import { ErrorRequestHandler, Request } from 'express';
import { Store as SessionStoreBackend } from 'express-session';

import { CreateAnswerCommand, CreateAnswerHandler } from '../../application/commands/CreateAnswerCommand';
import { CreateGameCommand, CreateGameHandler } from '../../application/commands/CreateGameCommand';
import { JoinGameCommand, JoinGameHandler } from '../../application/commands/JoinGameCommand';
import { LoginCommand, LoginHandler } from '../../application/commands/LoginCommand';
import { NextTurnHandler } from '../../application/commands/NextTurnCommand';
import { SelectWinnerCommand, SelectWinnerHandler } from '../../application/commands/SelectWinnerCommand';
import { StartGameCommand, StartGameHandler } from '../../application/commands/StartGameCommand';
import { SessionStore } from '../../application/interfaces/SessionStore';
import { GetGameHandler, GetGameQuery } from '../../application/queries/GetGameQuery';
import { GetPlayerHandler } from '../../application/queries/GetPlayerQuery';
import { DtoMapperService } from '../../application/services/DtoMapperService';
import { GameService } from '../../application/services/GameService';
import { RandomService } from '../../application/services/RandomService';
import { ConfigService } from '../../domain/interfaces/ConfigService';
import { ExternalData } from '../../domain/interfaces/ExternalData';
import { GameRepository } from '../../domain/interfaces/GameRepository';
import { PlayerRepository } from '../../domain/interfaces/PlayerRepository';
import { Player } from '../../domain/models/Player';

import { context, dto, errorHandler, guard, handler, middleware, status } from './middlewaresCreators';
import { FallbackRoute, InputDto, Route } from './Route';
import { createServer } from './web';
import { WebsocketRTCManager, WebsocketServer } from './websocket';

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

export interface Dependencies {
  configService: ConfigService;
  playerRepository: PlayerRepository;
  gameRepository: GameRepository;
  gameService: GameService;
  randomService: RandomService;
  externalData: ExternalData;
  wss: WebsocketServer;
  rtcManager: WebsocketRTCManager;
  sessionStore?: SessionStoreBackend;
  mapper: DtoMapperService;
}

export const bootstrapServer = async (deps: Dependencies) => {
  const {
    configService,
    playerRepository,
    gameRepository,
    gameService,
    randomService,
    externalData,
    wss,
    rtcManager,
    sessionStore,
    mapper,
  } = deps;

  const handlers = {
    getPlayer: new GetPlayerHandler(playerRepository, mapper),
    getGame: new GetGameHandler(gameService, mapper),
    login: new LoginHandler(playerRepository, mapper),
    createGame: new CreateGameHandler(configService, gameService, gameRepository, rtcManager, mapper),
    joinGame: new JoinGameHandler(gameService, gameRepository, rtcManager, mapper),
    startGame: new StartGameHandler(gameService, gameRepository, externalData),
    createAnswer: new CreateAnswerHandler(gameService, randomService),
    selectWinner: new SelectWinnerHandler(gameService),
    nextTurn: new NextTurnHandler(gameService, gameRepository),
  };

  const playerContext = [
    middleware(new PlayerProvider(deps.playerRepository)),
    context((req) => new ExpressSessionStore(req)),
  ];

  const authPlayerContext = [...playerContext, guard(isAuthenticated)];

  // prettier-ignore
  const routes = [

    new Route('get', '/player/me')
      .use(...authPlayerContext)
      .use(dto((req) => ({ playerId: req.session.playerId })))
      .use(handler(handlers.getPlayer)),

    new Route('get', '/player/:playerId')
      .use(...playerContext)
      .use(dto((req) => ({ playerId: req.params.playerId })))
      .use(handler(handlers.getPlayer)),

    new Route('post', '/login')
      .use(...playerContext)
      .use(guard(isNotAuthenticated))
      .use(dto(({ body }) => new LoginCommand(body.nick)))
      .use(status(201))
      .use(handler(handlers.login)),

    new Route('get', '/game/:gameId')
      .use(...authPlayerContext)
      .use(dto((req) => new GetGameQuery(req.params.gameId)))
      .use(handler(handlers.getGame)),

    new Route('post', '/game')
      .use(...authPlayerContext)
      .use(dto(() => new CreateGameCommand()))
      .use(status(201))
      .use(handler(handlers.createGame)),

    new Route('post', '/game/:gameCode/join')
      .use(...authPlayerContext)
      .use(dto((req) => new JoinGameCommand(req.params.gameCode)))
      .use(handler(handlers.joinGame)),

    new Route('post', '/start')
      .use(...authPlayerContext)
      .use(dto(({ body }) => new StartGameCommand(body.questionMasterId, body.turns)))
      .use(handler(handlers.startGame)),

    new Route('post', '/answer')
      .use(...authPlayerContext)
      .use(dto(({ body }) => new CreateAnswerCommand(body.choicesIds)))
      .use(handler(handlers.createAnswer)),

    new Route('post', '/select')
      .use(...authPlayerContext)
      .use(dto(({ body }) => new SelectWinnerCommand(body.answerId)))
      .use(handler(handlers.selectWinner)),

    new Route('post', '/next')
      .use(...authPlayerContext)
      .use(handler(handlers.nextTurn)),

    new Route('get', '/healthcheck')
      .use((req, res) => res.end()),

    new FallbackRoute()
      .use(errorHandler(new ErrorHandler()))
      .use((req, res) => res.status(404).end()),
  ];

  return createServer(routes, wss, sessionStore);
};
