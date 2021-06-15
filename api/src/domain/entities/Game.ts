import { Player } from './Player';
import { Question } from './Question';

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

  id!: number;

  code!: string;
  state!: GameState;

  players!: Player[];
}

export class StartedGame extends Game {
  override state!: GameState.started;
  playState!: PlayState;
  questionMaster!: Player;
  question!: Question;
  winner?: Player;
}
