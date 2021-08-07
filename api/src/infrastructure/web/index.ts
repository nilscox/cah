import { Request } from 'express';
import { Store as SessionStoreBackend } from 'express-session';

import {
  CreateAnswerCommand,
  CreateAnswerHandler,
} from '../../application/commands/CreateAnswerCommand/CreateAnswerCommand';
import { CreateGameCommand, CreateGameHandler } from '../../application/commands/CreateGameCommand/CreateGameCommand';
import { FlushCardsHandler } from '../../application/commands/FlushCardsCommand/FlushCardsCommand';
import { JoinGameCommand, JoinGameHandler } from '../../application/commands/JoinGameCommand/JoinGameCommand';
import { LeaveGameHandler } from '../../application/commands/LeaveGameCommand/LeaveGameCommand';
import { LoginCommand, LoginHandler } from '../../application/commands/LoginCommand/LoginCommand';
import { NextTurnHandler } from '../../application/commands/NextTurnCommand/NextTurnCommand';
import {
  SelectWinnerCommand,
  SelectWinnerHandler,
} from '../../application/commands/SelectWinnerCommand/SelectWinnerCommand';
import { StartGameCommand, StartGameHandler } from '../../application/commands/StartGameCommand/StartGameCommand';
import { PlayerRepository } from '../../application/interfaces/PlayerRepository';
import { SessionStore } from '../../application/interfaces/SessionStore';
import { GetGameHandler, GetGameQuery } from '../../application/queries/GetGameQuery/GetGameQuery';
import { GetPlayerHandler } from '../../application/queries/GetPlayerQuery/GetPlayerQuery';
import { GetTurnsHandler, GetTurnsQuery } from '../../application/queries/GetTurnsQuery/GetTurnsQuery';
import { Player } from '../../domain/models/Player';
import { instanciateHandlers } from '../../utils/dependencyInjection';
import { Dependencies } from '../Dependencies';

import { DomainErrorMapper, ErrorHandler } from './ErrorHandler';
import { context, dto, errorHandler, guard, handler, middleware, status } from './middlewaresCreators';
import { FallbackRoute, InputDto, Route } from './Route';
import { createServer } from './web';
import { WebsocketServer } from './websocket';

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

export const bootstrapServer = (deps: Dependencies, wss: WebsocketServer, sessionStore?: SessionStoreBackend) => {
  const handlers = instanciateHandlers(deps);

  const playerContext = [
    middleware(new PlayerProvider(deps.playerRepository)),
    context((req) => new ExpressSessionStore(req)),
  ];

  const authPlayerContext = [...playerContext, guard(isAuthenticated)];

  // prettier-ignore
  const routes = [
    new Route('get', '/healthcheck')
      .use(status(204))
      .use((_req, res) => res.end()),

    new Route('get', '/player/me')
      .use(...authPlayerContext)
      .use(dto((req) => ({ playerId: req.session.playerId })))
      .use(handler(handlers.get(GetPlayerHandler))),

    new Route('get', '/player/:playerId')
      .use(...playerContext)
      .use(dto((req) => ({ playerId: req.params.playerId })))
      .use(handler(handlers.get(GetPlayerHandler))),

    new Route('post', '/login')
      .use(...playerContext)
      .use(guard(isNotAuthenticated))
      .use(dto(({ body }) => new LoginCommand(body.nick)))
      .use(status(201))
      .use(handler(handlers.get(LoginHandler))),

    new Route('get', '/game/:gameId')
      .use(...authPlayerContext)
      .use(dto((req) => new GetGameQuery(req.params.gameId)))
      .use(handler(handlers.get(GetGameHandler))),

    new Route('get', '/game/:gameId/turns')
      .use(...authPlayerContext)
      .use(dto((req) => new GetTurnsQuery(req.params.gameId)))
      .use(handler(handlers.get(GetTurnsHandler))),

    new Route('post', '/game')
      .use(...authPlayerContext)
      .use(dto(() => new CreateGameCommand()))
      .use(status(201))
      .use(handler(handlers.get(CreateGameHandler))),

    new Route('post', '/game/:gameCode/join')
      .use(...authPlayerContext)
      .use(dto((req) => new JoinGameCommand(req.params.gameCode)))
      .use(handler(handlers.get(JoinGameHandler))),

    new Route('post', '/game/leave')
      .use(...authPlayerContext)
      .use(status(204))
      .use(handler(handlers.get(LeaveGameHandler))),

    new Route('post', '/start')
      .use(...authPlayerContext)
      .use(dto(({ body }) => new StartGameCommand(body.questionMasterId, body.turns)))
      .use(handler(handlers.get(StartGameHandler))),

    new Route('post', '/answer')
      .use(...authPlayerContext)
      .use(dto(({ body }) => new CreateAnswerCommand(body.choicesIds)))
      .use(handler(handlers.get(CreateAnswerHandler))),

    new Route('post', '/select')
      .use(...authPlayerContext)
      .use(dto(({ body }) => new SelectWinnerCommand(body.answerId)))
      .use(handler(handlers.get(SelectWinnerHandler))),

    new Route('post', '/next')
      .use(...authPlayerContext)
      .use(handler(handlers.get(NextTurnHandler))),

    new Route('post', '/flush-cards')
      .use(...authPlayerContext)
      .use(status(204))
      .use(handler(handlers.get(FlushCardsHandler))),

    new FallbackRoute()
      .use(errorHandler(new DomainErrorMapper()))
      .use(errorHandler(new ErrorHandler(deps.logger())))
      .use((_req, res) => res.status(404).end()),
  ];

  return createServer(routes, wss, sessionStore);
};
