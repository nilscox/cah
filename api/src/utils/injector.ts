import { CreateAnswerHandler } from '../application/commands/CreateAnswerCommand/CreateAnswerCommand';
import { CreateGameHandler } from '../application/commands/CreateGameCommand/CreateGameCommand';
import { FlushCardsHandler } from '../application/commands/FlushCardsCommand/FlushCardsCommand';
import { JoinGameHandler } from '../application/commands/JoinGameCommand/JoinGameCommand';
import { LoginHandler } from '../application/commands/LoginCommand/LoginCommand';
import { NextTurnHandler } from '../application/commands/NextTurnCommand/NextTurnCommand';
import { SelectWinnerHandler } from '../application/commands/SelectWinnerCommand/SelectWinnerCommand';
import { StartGameHandler } from '../application/commands/StartGameCommand/StartGameCommand';
import { GameEventsHandler } from '../application/handlers/GameEventsHandler/GameEventsHandler';
import { PlayerEventsHandler } from '../application/handlers/PlayerEventsHandler/PlayerEventsHandler';
import { Logger } from '../application/interfaces/Logger';
import { GetGameHandler } from '../application/queries/GetGameQuery/GetGameQuery';
import { GetPlayerHandler } from '../application/queries/GetPlayerQuery/GetPlayerQuery';
import { GetTurnsHandler } from '../application/queries/GetTurnsQuery/GetTurnsQuery';
import { CommandHandler } from '../ddd/CommandHandler';
import { EventHandler } from '../ddd/EventHandler';
import { QueryHandler } from '../ddd/QueryHandler';
import { Dependencies } from '../infrastructure/Dependencies';

import { ClassType } from './types';

type Handler = CommandHandler<unknown, unknown> | QueryHandler<unknown, unknown> | EventHandler<unknown>;

type HandlersMap<T extends Handler> = Array<[ClassType<T>, T]>;

export interface HandlersContainer {
  get<T extends Handler>(Handler: ClassType<T>): T;
}

export const instanciateHandlers = (deps: Dependencies, defaultLogger?: Logger) => {
  const logger = defaultLogger ? () => defaultLogger : deps.logger;

  const {
    configService,
    notifier,
    gameService,
    randomService,
    gameRepository,
    playerRepository,
    rtcManager,
    externalData,
    mapper,
  } = deps;

  const commands: HandlersMap<CommandHandler<unknown, unknown>> = [
    [CreateAnswerHandler, new CreateAnswerHandler(gameService, randomService)],
    [CreateGameHandler, new CreateGameHandler(configService, gameService, gameRepository, rtcManager, mapper)],
    [NextTurnHandler, new NextTurnHandler(gameService, gameRepository)],
    [JoinGameHandler, new JoinGameHandler(gameService, gameRepository, rtcManager, mapper)],
    [LoginHandler, new LoginHandler(playerRepository, mapper)],
    [SelectWinnerHandler, new SelectWinnerHandler(gameService)],
    [StartGameHandler, new StartGameHandler(gameService, gameRepository, externalData)],
    [FlushCardsHandler, new FlushCardsHandler(playerRepository, gameService)],
  ];

  const queries: HandlersMap<QueryHandler<unknown, unknown>> = [
    [GetGameHandler, new GetGameHandler(gameService, mapper)],
    [GetPlayerHandler, new GetPlayerHandler(playerRepository, mapper)],
    [GetTurnsHandler, new GetTurnsHandler(gameRepository, mapper)],
  ];

  const eventHandlers: HandlersMap<EventHandler<unknown>> = [
    [GameEventsHandler, new GameEventsHandler(logger(), notifier, rtcManager)],
    [PlayerEventsHandler, new PlayerEventsHandler(logger(), notifier)],
  ];

  return new Map([...commands, ...queries, ...eventHandlers]) as HandlersContainer;
};

export const instanciateHandler = <T extends Handler>(
  Handler: ClassType<T>,
  deps: Dependencies,
  logger?: Logger,
): T => {
  const handlers = instanciateHandlers(deps, logger);
  const handler = handlers.get(Handler);

  if (!handler) {
    throw new Error('instanciateHandler: cannot find instance for handler ' + Handler.name);
  }

  return handler;
};
