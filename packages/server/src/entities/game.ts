import { createId } from 'src/utils/create-id';
import { factory } from 'src/utils/factory';

export type Game = {
  id: string;
  code: string;
  state: GameState;
};

export const createGame = factory<Game>(() => ({
  id: createId(),
  code: '',
  state: GameState.idle,
}));

export type StartedGame = Game & {
  questionMasterId: string;
  questionId: string;
  selectedAnswerId?: string;
};

export const createStartedGame = factory<StartedGame>(() => ({
  ...createGame(),
  state: GameState.started,
  questionMasterId: '',
  questionId: '',
}));

export enum GameState {
  idle = 'idle',
  started = 'started',
  finished = 'finished',
}

export const isStarted = (game: Game): game is StartedGame => {
  return game.state === GameState.started;
};
