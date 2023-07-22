import { Container, token } from 'ditox';

import {
  ConfigPort,
  EventPublisherPort,
  ExternalDataPort,
  GeneratorPort,
  LoggerPort,
  RandomPort,
  RtcPort,
} from './adapters';
import { AuthenticateHandler } from './commands/authenticate/authenticate';
import { CreateAnswerHandler } from './commands/create-answer/create-answer';
import { CreateGameHandler } from './commands/create-game/create-game';
import { DealCardsHandler } from './commands/deal-cards/deal-cards';
import { HandleEndOfPlayersAnswerHandler } from './commands/handle-end-of-players-answer/handle-end-of-players-answer';
import { JoinGameHandler } from './commands/join-game/join-game';
import { StartGameHandler } from './commands/start-game/start-game';
import { Notifier } from './notifier/notifier';
import {
  AnswerRepository,
  ChoiceRepository,
  GameRepository,
  PlayerRepository,
  QuestionRepository,
} from './persistence';
import { Database } from './persistence/database';
import { GetGameHandler } from './queries/get-game';
import { GetPlayerHandler } from './queries/get-player';
import { Server } from './server/server';

export const TOKENS = {
  container: token<Container>('container'),

  config: token<ConfigPort>('config'),
  logger: token<LoggerPort>('logger'),
  random: token<RandomPort>('random'),
  generator: token<GeneratorPort>('generator'),
  externalData: token<ExternalDataPort>('externalData'),

  publisher: token<EventPublisherPort>('publisher'),
  server: token<Server>('server'),
  rtc: token<RtcPort>('rtc'),
  notifier: token<Notifier>('notifier'),
  database: token<Database>('database'),

  repositories: {
    game: token<GameRepository>('gameRepository'),
    player: token<PlayerRepository>('playerRepository'),
    question: token<QuestionRepository>('questionRepository'),
    choice: token<ChoiceRepository>('choiceRepository'),
    answer: token<AnswerRepository>('answerRepository'),
  },

  commands: {
    authenticate: token<AuthenticateHandler>('authenticate'),
    createGame: token<CreateGameHandler>('createGame'),
    joinGame: token<JoinGameHandler>('joinGame'),
    startGame: token<StartGameHandler>('startGame'),
    dealCards: token<DealCardsHandler>('dealCards'),
    createAnswer: token<CreateAnswerHandler>('createAnswer'),
    handleEndOfPlayersAnswer: token<HandleEndOfPlayersAnswerHandler>('handleEndOfPlayersAnswer'),
  },

  queries: {
    getGame: token<GetGameHandler>('getGame'),
    getPlayer: token<GetPlayerHandler>('getPlayer'),
  },
};
