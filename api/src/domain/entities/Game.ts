import { Answer } from './Answer';
import { Player } from './Player';
import { Question } from './Question';
import { Turn } from './Turn';

export enum GameState {
  idle = 'idle',
  started = 'started',
  finished = 'finished',
  paused = 'paused',
}

export enum PlayState {
  playersAnswer = 'playersAnswer',
  questionMasterSelection = 'questionMasterSelection',
  endOfTurn = 'endOfTurn',
}

export class Game {
  static readonly cardsPerPlayer = 11;

  code!: string;
  state!: GameState;
  players!: Player[];

  playState?: PlayState;
  questionMaster?: Player;
  question?: Question;
  answers?: Answer[];
  winner?: Player;
  turns?: Turn[];

  get playersExcludingQM() {
    return this.players.filter((player) => !player.is(this.questionMaster));
  }
}
