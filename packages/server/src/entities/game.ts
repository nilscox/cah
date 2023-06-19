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
