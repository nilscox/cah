import { AnonymousAnswer, Answer } from './Answer';
import { Question } from './Question';
import { Turn } from './Turn';

export type Game = {
  id: string;
  creator: string;
  code: string;
  state: GameState;
  players: Record<string, GamePlayer>;
  turns: Turn[];
};

export type StartedGame = Game & {
  playState: PlayState;
  totalQuestions: number;
  questionMaster: string;
  question: Question;
  answers: AnonymousAnswer[] | Answer[];
  winner?: string;
};

export const isGameStarted = (game: Game): game is StartedGame => {
  return game.state === GameState.started;
};

export enum GameState {
  idle = 'idle',
  started = 'started',
  finished = 'finished',
}

export enum PlayState {
  playersAnswer = 'playersAnswer',
  questionMasterSelection = 'questionMasterSelection',
  endOfTurn = 'endOfTurn',
}

export type GamePlayer = {
  id: string;
  nick: string;
  isConnected: boolean;
};

export type Score = [GamePlayer, number];
