import { Answer } from './answer';

export type Game = {
  id: string;
  code: string;
  state: GameState;
};

export type StartedGame = Game & {
  questionMasterId: string;
  questionId: string;
  answers: Answer[];
};

export enum GameState {
  idle = 'idle',
  started = 'started',
  finished = 'finished',
}

export const isStarted = (game: Game): game is StartedGame => {
  return game.state === GameState.started;
};
