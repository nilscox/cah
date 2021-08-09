import { AnonymousAnswer, Answer } from './Answer';
import { Player } from './Player';
import { Question } from './Question';
import { Turn } from './Turn';

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

export interface Game {
  id: string;
  creator: Player;
  code: string;
  state: GameState;
  players: Player[];
  turns: Turn[];
}

export interface StartedGame extends Game {
  playState: PlayState;
  totalQuestions: number;
  questionMaster: Player;
  question: Question;
  answers: AnonymousAnswer[] | Answer[];
  winner?: Player;
}

export const isStarted = (game: Game): game is StartedGame => {
  return game.state === GameState.started;
};
