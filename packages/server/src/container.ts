import { bindModule, createContainer, declareModule, injectable, injectableClass } from 'ditox';

import {
  ConsoleLoggerAdapter,
  RealEventPublisherAdapter,
  StubConfigAdapter,
  StubExternalDataAdapter,
  StubRandomAdapter,
} from 'src/adapters';
import {
  AnswerRepository,
  ChoiceRepository,
  GameRepository,
  InMemoryAnswerRepository,
  InMemoryChoiceRepository,
  InMemoryGameRepository,
  InMemoryPlayerRepository,
  InMemoryQuestionRepository,
  PlayerRepository,
  QuestionRepository,
} from 'src/persistence';

import { MathRandomGeneratorAdapter } from './adapters/generator/math-random-generator.adapter';
import { AuthenticateHandler } from './commands/authenticate/authenticate';
import { CreateAnswerHandler } from './commands/create-answer/create-answer';
import { CreateGameHandler } from './commands/create-game/create-game';
import { DealCardsHandler } from './commands/deal-cards/deal-cards';
import { HandleEndOfPlayersAnswerHandler } from './commands/handle-end-of-players-answer/handle-end-of-players-answer';
import { JoinGameHandler } from './commands/join-game/join-game';
import { StartGameHandler } from './commands/start-game/start-game';
import { Notifier } from './notifier/notifier';
import { Database } from './persistence/database';
import { SqlAnswerRepository } from './persistence/repositories/answer/sql-answer.repository';
import { SqlChoiceRepository } from './persistence/repositories/choice/sql-choice.repository';
import { SqlGameRepository } from './persistence/repositories/game/sql-game.repository';
import { SqlPlayerRepository } from './persistence/repositories/player/sql-player.repository';
import { SqlQuestionRepository } from './persistence/repositories/question/sql-question.repository';
import { GetGameHandler } from './queries/get-game';
import { GetPlayerHandler } from './queries/get-player';
import { Server } from './server/server';
import { TOKENS } from './tokens';
import { toObject } from './utils/to-object';

type PersistenceModule = {
  gameRepository: GameRepository;
  playerRepository: PlayerRepository;
  questionRepository: QuestionRepository;
  choiceRepository: ChoiceRepository;
  answerRepository: AnswerRepository;
};

export const inMemoryPersistenceModule = declareModule<PersistenceModule>({
  factory: () => ({
    gameRepository: new InMemoryGameRepository(),
    playerRepository: new InMemoryPlayerRepository(),
    questionRepository: new InMemoryQuestionRepository(),
    choiceRepository: new InMemoryChoiceRepository(),
    answerRepository: new InMemoryAnswerRepository(),
  }),
  exports: {
    gameRepository: TOKENS.repositories.game,
    playerRepository: TOKENS.repositories.player,
    questionRepository: TOKENS.repositories.question,
    choiceRepository: TOKENS.repositories.choice,
    answerRepository: TOKENS.repositories.answer,
  },
});

export const sqlPersistenceModule = declareModule<PersistenceModule>({
  factory: injectable(
    (db) => ({
      gameRepository: new SqlGameRepository(db),
      playerRepository: new SqlPlayerRepository(db),
      questionRepository: new SqlQuestionRepository(db),
      choiceRepository: new SqlChoiceRepository(db),
      answerRepository: new SqlAnswerRepository(db),
    }),
    TOKENS.database
  ),
  exports: {
    gameRepository: TOKENS.repositories.game,
    playerRepository: TOKENS.repositories.player,
    questionRepository: TOKENS.repositories.question,
    choiceRepository: TOKENS.repositories.choice,
    answerRepository: TOKENS.repositories.answer,
  },
});

type AppModule = {
  authenticate: AuthenticateHandler;
  createGame: CreateGameHandler;
  joinGame: JoinGameHandler;
  startGame: StartGameHandler;
  dealCards: DealCardsHandler;
  getGame: GetGameHandler;
  getPlayer: GetPlayerHandler;
};

export const appModule = declareModule<AppModule>({
  factory: (container) => ({
    authenticate: AuthenticateHandler.inject(container),
    createGame: CreateGameHandler.inject(container),
    joinGame: JoinGameHandler.inject(container),
    startGame: StartGameHandler.inject(container),
    dealCards: DealCardsHandler.inject(container),
    createAnswer: CreateAnswerHandler.inject(container),
    handleEndOfPlayersAnswer: HandleEndOfPlayersAnswerHandler.inject(container),
    getGame: GetGameHandler.inject(container),
    getPlayer: GetPlayerHandler.inject(container),
  }),
  // prettier-ignore
  exports: {
    ...toObject(Object.entries(TOKENS.commands), ([key]) => key, ([, token]) => token),
    ...toObject(Object.entries(TOKENS.queries), ([key]) => key, ([, token]) => token),
  },
});

export const container = createContainer();

container.bindValue(TOKENS.container, container);

container.bindValue(TOKENS.config, new StubConfigAdapter());
container.bindFactory(TOKENS.logger, () => new ConsoleLoggerAdapter(), { scope: 'transient' });
container.bindFactory(TOKENS.random, injectableClass(StubRandomAdapter));
container.bindFactory(TOKENS.generator, injectableClass(MathRandomGeneratorAdapter));
container.bindFactory(TOKENS.externalData, injectableClass(StubExternalDataAdapter));

// prettier-ignore
{
  container.bindFactory(TOKENS.publisher, injectableClass(RealEventPublisherAdapter, TOKENS.logger));
  container.bindFactory(TOKENS.server, injectableClass(Server, TOKENS.config, TOKENS.logger, TOKENS.publisher, TOKENS.container));
  container.bindFactory(TOKENS.rtc, injectable((server) => server.rtc, TOKENS.server));
  container.bindFactory(TOKENS.notifier, injectableClass(Notifier, TOKENS.rtc, TOKENS.publisher, TOKENS.repositories.game, TOKENS.repositories.player, TOKENS.repositories.choice, TOKENS.repositories.question, TOKENS.repositories.answer));
  container.bindFactory(TOKENS.database, Database.inject);
}

bindModule(container, sqlPersistenceModule);
bindModule(container, appModule);
