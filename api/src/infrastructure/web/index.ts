import { ErrorRequestHandler, Request } from 'express';

import { CreateAnswerCommand, CreateAnswerCommandHandler } from '../../application/commands/CreateAnswerCommand';
import { LoginCommand, LoginHandler } from '../../application/commands/LoginCommand';
import { NextTurnCommand, NextTurnHandler } from '../../application/commands/NextTurnCommand';
import { SelectWinnerCommand, SelectWinnerHandler } from '../../application/commands/SelectWinnerCommand';
import { StartGameCommand, StartGameHandler } from '../../application/commands/StartGameCommand';
import { SessionStore } from '../../application/interfaces/SessionStore';
import { GetPlayerHandler } from '../../application/queries/GetPlayerQuery';
import { GameService } from '../../application/services/GameService';
import { RandomService } from '../../application/services/RandomService';
import { Player } from '../../domain/models/Player';
import { InMemoryGameRepository } from '../repositories/InMemoryGameRepository';
import { InMemoryPlayerRepository } from '../repositories/InMemoryPlayerRepository';
import { StubEventPublisher } from '../stubs/StubEventPublisher';
import { StubExternalData } from '../stubs/StubExternalData';

import { context, dto, errorHandler, FallbackRoute, guard, handler, InputDto, middleware, Route } from './Route';
import { bootstrapServer } from './web';

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
  constructor(private readonly playerRepository: InMemoryPlayerRepository) {}

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

const playerRepository = new InMemoryPlayerRepository();
const gameRepository = new InMemoryGameRepository();

const gameService = new GameService(playerRepository, gameRepository);
const randomService = new RandomService();
const externalData = new StubExternalData();
const publisher = new StubEventPublisher();

const playerContext = [
  middleware(new PlayerProvider(playerRepository)),
  context((req) => new ExpressSessionStore(req)),
];

const authPlayerContext = [...playerContext, guard(isAuthenticated)];

const routes = [
  new Route('post', '/login')
    .use(...playerContext)
    .use(guard(isNotAuthenticated))
    .use(dto(({ body }) => new LoginCommand(body.nick)))
    .use(handler(new LoginHandler(playerRepository))),

  new Route('get', '/player/me')
    .use(...authPlayerContext)
    .use(dto((req) => ({ playerId: req.session.playerId })))
    .use(handler(new GetPlayerHandler(playerRepository))),

  new Route('get', '/player/:playerId')
    .use(...playerContext)
    .use(dto((req) => ({ playerId: req.params.playerId })))
    .use(handler(new GetPlayerHandler(playerRepository))),

  new Route('post', '/start')
    .use(...authPlayerContext)
    .use(dto(({ body }) => new StartGameCommand(body.questionMasterId, body.turns)))
    .use(handler(new StartGameHandler(gameService, gameRepository, externalData, publisher))),

  new Route('post', '/answer')
    .use(...authPlayerContext)
    .use(dto(({ body }) => new CreateAnswerCommand(body.playerId, body.cohicesIds)))
    .use(handler(new CreateAnswerCommandHandler(gameService, randomService, publisher))),

  new Route('post', '/select')
    .use(...authPlayerContext)
    .use(dto(({ body }) => new SelectWinnerCommand(body.playerId, body.answerId)))
    .use(handler(new SelectWinnerHandler(gameService, publisher))),

  new Route('post', '/next')
    .use(...authPlayerContext)
    .use(dto(({ body }) => new NextTurnCommand(body.playerId)))
    .use(handler(new NextTurnHandler(gameService, gameRepository, publisher))),

  // prettier-ignore
  new FallbackRoute()
    .use(errorHandler(new ErrorHandler()))
    .use((req, res) => res.status(404).end()),
];

export const app = bootstrapServer(routes);
