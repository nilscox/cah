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
import { CreateGameHandler } from './commands/create-game/create-game';
import { DealCardsHandler } from './commands/deal-cards/deal-cards';
import { JoinGameHandler } from './commands/join-game/join-game';
import { StartGameHandler } from './commands/start-game/start-game';
import { Notifier } from './notifier/notifier';
import { GetGameHandler } from './queries/get-game';
import { GetPlayerHandler } from './queries/get-player';
import { Server } from './server/server';
import { TOKENS } from './tokens';

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
  factory: (container) => {
    const { random, generator, publisher, externalData, repositories } = TOKENS;

    // prettier-ignore
    const { game: gameRepository, player: playerRepository, question: questionRepository, choice: choiceRepository } = repositories;

    // prettier-ignore
    return {
      authenticate: injectableClass(AuthenticateHandler, generator, publisher, playerRepository)(container),
      createGame: injectableClass(CreateGameHandler, generator, publisher, playerRepository, gameRepository)(container),
      joinGame: injectableClass(JoinGameHandler, publisher, gameRepository, playerRepository)(container),
      startGame: injectableClass(StartGameHandler, random, publisher, externalData, gameRepository, playerRepository, questionRepository, choiceRepository)(container),
      dealCards: injectableClass(DealCardsHandler, publisher, gameRepository, playerRepository, choiceRepository)(container),
      getGame: injectableClass(GetGameHandler, gameRepository, playerRepository, questionRepository)(container),
      getPlayer: injectableClass(GetPlayerHandler, playerRepository)(container),
    };
  },
  exports: {
    authenticate: TOKENS.commands.authenticate,
    createGame: TOKENS.commands.createGame,
    joinGame: TOKENS.commands.joinGame,
    startGame: TOKENS.commands.startGame,
    dealCards: TOKENS.commands.dealCards,
    getGame: TOKENS.queries.getGame,
    getPlayer: TOKENS.queries.getPlayer,
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
  container.bindFactory(TOKENS.notifier, injectableClass(Notifier, TOKENS.rtc, TOKENS.publisher, TOKENS.repositories.game, TOKENS.repositories.player, TOKENS.repositories.choice, TOKENS.repositories.question));
}

bindModule(container, inMemoryPersistenceModule);
bindModule(container, appModule);
