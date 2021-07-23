import { Answer } from './Answer';
import { Player } from './Player';
import { Question } from './Question';

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
  code: string;
  state: GameState;
  players: Player[];
}

export interface StartedGame extends Game {
  playState: PlayState;
  questionMaster: Player;
  question: Question;
  answers: Answer[];
  winner?: string;
}
