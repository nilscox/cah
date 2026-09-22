import { type Container, token } from 'ditox';

import type {
  ConfigPort,
  EventPublisherPort,
  ExternalDataPort,
  GeneratorPort,
  LoggerPort,
  RandomPort,
  RtcPort,
} from './adapters/index.ts';
import type { AuthenticateHandler } from './commands/authenticate/authenticate.ts';
import type { CreateAnswerHandler } from './commands/create-answer/create-answer.ts';
import type { CreateGameHandler } from './commands/create-game/create-game.ts';
import type { DealCardsHandler } from './commands/deal-cards/deal-cards.ts';
import type { EndGameHandler } from './commands/end-game/end-game.ts';
import type { EndTurnHandler } from './commands/end-turn/end-turn.ts';
import type { HandleEndOfPlayersAnswerHandler } from './commands/handle-end-of-players-answer/handle-end-of-players-answer.ts';
import type { JoinGameHandler } from './commands/join-game/join-game.ts';
import type { LeaveGameHandler } from './commands/leave-game/leave-game.ts';
import type { SelectWinningAnswerHandler } from './commands/select-winning-answer/select-winning-answer.ts';
import type { StartGameHandler } from './commands/start-game/start-game.ts';
import type { StartTurnHandler } from './commands/start-turn/start-turn.ts';
import type { Notifier } from './notifier/notifier.ts';
import type { Database } from './persistence/database.ts';
import type {
  AnswerRepository,
  ChoiceRepository,
  GameRepository,
  PlayerRepository,
  QuestionRepository,
  TurnRepository,
} from './persistence/index.ts';
import type { Server } from './server/server.ts';

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
    turn: token<TurnRepository>('turnRepository'),
  },

  commands: {
    authenticate: token<AuthenticateHandler>('authenticate'),
    createGame: token<CreateGameHandler>('createGame'),
    joinGame: token<JoinGameHandler>('joinGame'),
    startGame: token<StartGameHandler>('startGame'),
    startTurn: token<StartTurnHandler>('startTurn'),
    dealCards: token<DealCardsHandler>('dealCards'),
    createAnswer: token<CreateAnswerHandler>('createAnswer'),
    handleEndOfPlayersAnswer: token<HandleEndOfPlayersAnswerHandler>('handleEndOfPlayersAnswer'),
    selectWinningAnswer: token<SelectWinningAnswerHandler>('selectWinningAnswer'),
    endTurn: token<EndTurnHandler>('endTurn'),
    endGame: token<EndGameHandler>('endGame'),
    leaveGame: token<LeaveGameHandler>('leaveGame'),
  },
};
