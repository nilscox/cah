import { toObject } from '@cah/utils';
import { bindModule, declareModule, createContainer as ditoxCreateContainer, injectable } from 'ditox';

import { ConsoleLoggerAdapter, RealEventPublisherAdapter } from 'src/adapters';

import { EnvConfigAdapter } from './adapters/config/env-config.adapter';
import { FilesystemExternalDataAdapter } from './adapters/external-data/filesystem-external-data.adapter';
import { RandomGeneratorAdapter } from './adapters/generator/random-generator.adapter';
import { MathRandomAdapter } from './adapters/random/math-random.adapter';
import { AuthenticateHandler } from './commands/authenticate/authenticate';
import { CreateAnswerHandler } from './commands/create-answer/create-answer';
import { CreateGameHandler } from './commands/create-game/create-game';
import { DealCardsHandler } from './commands/deal-cards/deal-cards';
import { EndGameHandler } from './commands/end-game/end-game';
import { EndTurnHandler } from './commands/end-turn/end-turn';
import { HandleEndOfPlayersAnswerHandler } from './commands/handle-end-of-players-answer/handle-end-of-players-answer';
import { JoinGameHandler } from './commands/join-game/join-game';
import { LeaveGameHandler } from './commands/leave-game/leave-game';
import { SelectWinningAnswerHandler } from './commands/select-winning-answer/select-winning-answer';
import { StartGameHandler } from './commands/start-game/start-game';
import { StartTurnHandler } from './commands/start-turn/start-turn';
import { Notifier } from './notifier/notifier';
import { sqlPersistenceModule } from './persistence';
import { Database } from './persistence/database';
import { Server } from './server/server';
import { TOKENS } from './tokens';

export const appModule = declareModule({
  factory: (container) => ({
    authenticate: AuthenticateHandler.inject(container),
    createGame: CreateGameHandler.inject(container),
    joinGame: JoinGameHandler.inject(container),
    startGame: StartGameHandler.inject(container),
    startTurn: StartTurnHandler.inject(container),
    dealCards: DealCardsHandler.inject(container),
    createAnswer: CreateAnswerHandler.inject(container),
    handleEndOfPlayersAnswer: HandleEndOfPlayersAnswerHandler.inject(container),
    selectWinningAnswer: SelectWinningAnswerHandler.inject(container),
    endTurn: EndTurnHandler.inject(container),
    endGame: EndGameHandler.inject(container),
    leaveGame: LeaveGameHandler.inject(container),
  }),
  exports: toObject(
    Object.entries(TOKENS.commands),
    ([key]) => key,
    ([, token]) => token,
  ),
});

export const createContainer = () => {
  const container = ditoxCreateContainer();

  container.bindValue(TOKENS.container, container);

  container.bindFactory(TOKENS.config, EnvConfigAdapter.inject);
  container.bindFactory(TOKENS.logger, ConsoleLoggerAdapter.inject, { scope: 'transient' });
  container.bindFactory(TOKENS.random, MathRandomAdapter.inject);
  container.bindFactory(TOKENS.generator, RandomGeneratorAdapter.inject);
  container.bindFactory(TOKENS.externalData, FilesystemExternalDataAdapter.inject);

  container.bindFactory(TOKENS.publisher, RealEventPublisherAdapter.inject);
  container.bindFactory(TOKENS.server, Server.inject);
  container.bindFactory(TOKENS.notifier, Notifier.inject);
  container.bindFactory(TOKENS.database, Database.inject);

  container.bindFactory(
    TOKENS.rtc,
    injectable((server) => server.rtc, TOKENS.server),
  );

  bindModule(container, sqlPersistenceModule);
  bindModule(container, appModule);

  return container;
};
