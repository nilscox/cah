import * as yup from 'yup';

import { createId } from './create-id';
import { factory } from './factory';

export type Game = {
  id: string;
  code: string;
  state: GameState;
  players: GamePlayer[];
};

export const createGame = factory<Game>(() => ({
  id: createId(),
  code: '',
  state: GameState.idle,
  players: [],
}));

export type StartedGame = Game & {
  questionMaster: { id: string; nick: string };
  question: Question;
  answers: Array<Answer | AnonymousAnswer>;
  selectedAnswerId?: string;
};

export const createStartedGame = factory<StartedGame>(() => ({
  ...createGame({ state: GameState.started }),
  questionMaster: createGamePlayer(),
  question: createQuestion(),
  answers: [],
}));

export const isStarted = (game: Game | undefined): game is StartedGame => {
  return game?.state === GameState.started;
};

export enum GameState {
  idle = 'idle',
  started = 'started',
  finished = 'finished',
}

export type GamePlayer = {
  id: string;
  nick: string;
};

export const createGamePlayer = factory<GamePlayer>(() => ({
  id: createId(),
  nick: '',
}));

export type CurrentPlayer = GamePlayer & {
  gameId?: string;
  cards?: Array<Choice>;
  submittedAnswer?: Answer;
};

export const createCurrentPlayer = factory<CurrentPlayer>(() => ({
  id: createId(),
  nick: '',
}));

export type Question = {
  id: string;
  text: string;
  blanks?: number[];
};

export const createQuestion = factory<Question>(() => ({
  id: createId(),
  text: '',
}));

export type Choice = {
  id: string;
  text: string;
  caseSensitive: boolean;
};

export const createChoice = factory<Choice>(() => ({
  id: createId(),
  text: '',
  caseSensitive: false,
}));

export type Answer = {
  id: string;
  playerId: string;
  choices: Array<Choice>;
};

export type AnonymousAnswer = Omit<Answer, 'playerId'>;

export const createAnswer = factory<Answer>(() => ({
  id: createId(),
  playerId: '',
  choices: [],
}));

export const createAnonymousAnswer = factory<AnonymousAnswer>(() => ({
  id: createId(),
  choices: [],
}));

export type Turn = {
  id: string;
  number: number;
  question: Question;
  answers: Answer[];
  winningAnswerId: string;
};

export const createTurn = factory<Turn>(() => ({
  id: createId(),
  number: 0,
  question: createQuestion(),
  answers: [],
  winningAnswerId: '',
}));

export type PlayerConnectedEvent = {
  type: 'player-connected';
  playerId: string;
};

export type PlayerDisconnectedEvent = {
  type: 'player-disconnected';
  playerId: string;
};

export type GameCreatedEvent = {
  type: 'game-created';
  gameId: string;
  code: string;
};

export type PlayerJoinedEvent = {
  type: 'player-joined';
  playerId: string;
  nick: string;
};

export type PlayerLeftEvent = {
  type: 'player-left';
  playerId: string;
};

export type GameStartedEvent = {
  type: 'game-started';
  gameId: string;
};

export type TurnStartedEvent = {
  type: 'turn-started';
  gameId: string;
  questionMasterId: string;
  question: Question;
};

export type CardsDealtEvent = {
  type: 'cards-dealt';
  playerId: string;
  cards: Choice[];
};

export type PlayerAnsweredEvent = {
  type: 'player-answered';
  playerId: string;
};

export type AllPlayerAnsweredEvent = {
  type: 'all-players-answered';
  answers: Array<AnonymousAnswer>;
};

export type WinningAnswerSelectedEvent = {
  type: 'winning-answer-selected';
  selectedAnswerId: string;
  answers: Array<Answer>;
};

export type TurnEndedEvent = {
  type: 'turn-ended';
};

export type GameEndedEvent = {
  type: 'game-ended';
};

export type GameEvent =
  | PlayerConnectedEvent
  | PlayerDisconnectedEvent
  | GameCreatedEvent
  | PlayerJoinedEvent
  | PlayerLeftEvent
  | GameStartedEvent
  | TurnStartedEvent
  | CardsDealtEvent
  | PlayerAnsweredEvent
  | AllPlayerAnsweredEvent
  | WinningAnswerSelectedEvent
  | TurnEndedEvent
  | GameEndedEvent;

export type GameEventType = GameEvent['type'];
export type GameEventsMap = { [T in GameEventType]: Extract<GameEvent, { type: T }> };

export const authenticateBodySchema = yup.object({
  nick: yup.string().min(2).max(24).required(),
});

export type AuthenticateBody = yup.InferType<typeof authenticateBodySchema>;

export const startGameBodySchema = yup.object({
  numberOfQuestions: yup.number().min(1).required(),
});

export type StartGameBody = yup.InferType<typeof startGameBodySchema>;

export const createAnswerBodySchema = yup.object({
  choicesIds: yup.array(yup.string().required()).min(1).required(),
});

export type CreateAnswerBody = yup.InferType<typeof createAnswerBodySchema>;
