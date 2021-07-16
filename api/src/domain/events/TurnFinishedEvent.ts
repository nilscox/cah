import { Game } from '../models/Game';

export class TurnFinishedEvent {
  readonly type = 'TurnFinished';
  constructor(public readonly game: Game) {}
}
