import { Game } from '../models/Game';

export class GameFinishedEvent {
  readonly type = 'GameFinished';
  constructor(public readonly game: Game) {}
}
