import { Game } from '../models/Game';

export class WinnerSelectedEvent {
  readonly type = 'WinnerSelected';
  constructor(public readonly game: Game) {}
}
