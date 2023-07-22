export type Game = {
  id: string;
  code: string;
  state: GameState;
  players: Array<{
    id: string;
    nick: string;
  }>;
  questionMasterId?: string;
  question?: Question;
  answers?: Array<Answer | AnonymousAnswer>;
  selectedAnswerId?: string;
};

export enum GameState {
  idle = 'idle',
  started = 'started',
  finished = 'finished',
}

export type Player = {
  id: string;
  nick: string;
  gameId?: string;
  cards?: Array<Choice>;
};

export type Question = {
  id: string;
  text: string;
  blanks?: number[];
};

export type Choice = {
  id: string;
  text: string;
  caseSensitive: boolean;
};

export type Answer = {
  id: string;
  playerId: string;
  choices: Array<Choice>;
};

export type AnonymousAnswer = Omit<Answer, 'playerId'>;

export type PlayerConnectedEvent = {
  type: 'player-connected';
  nick: string;
};

export type PlayerDisconnectedEvent = {
  type: 'player-connected';
  nick: string;
};

export type GameCreatedEvent = {
  type: 'game-created';
  gameId: string;
  code: string;
};

export type PlayerJoinedEvent = {
  type: 'player-joined';
  gameId: string;
  playerId: string;
  nick: string;
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

export type GameEvent =
  | PlayerConnectedEvent
  | PlayerDisconnectedEvent
  | GameCreatedEvent
  | PlayerJoinedEvent
  | GameStartedEvent
  | TurnStartedEvent
  | CardsDealtEvent
  | PlayerAnsweredEvent
  | AllPlayerAnsweredEvent
  | WinningAnswerSelectedEvent;
