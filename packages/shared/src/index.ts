export type Game = {
  id: string;
  code: string;
  state: GameState;
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
  nick: string;
};

export type GameStartedEvent = {
  type: 'game-started';
  gameId: string;
  questionMasterId: string;
  questionId: string;
};

export type GameEvent =
  | PlayerConnectedEvent
  | PlayerDisconnectedEvent
  | GameCreatedEvent
  | PlayerJoinedEvent
  | GameStartedEvent;
