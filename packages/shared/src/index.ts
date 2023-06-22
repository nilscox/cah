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
};

export type Question = {
  id: string;
  text: string;
};

export type Choice = {
  id: string;
  text: string;
  caseSensitive: boolean;
};

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

export type GameEvent =
  | PlayerConnectedEvent
  | PlayerDisconnectedEvent
  | GameCreatedEvent
  | PlayerJoinedEvent
  | GameStartedEvent
  | TurnStartedEvent
  | CardsDealtEvent;
