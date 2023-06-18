export type Game = {
  code: string;
  state: GameState;
};

export enum GameState {
  idle = 'idle',
  started = 'started',
  finished = 'finished',
}

export type Player = {
  gameId?: string;
};
