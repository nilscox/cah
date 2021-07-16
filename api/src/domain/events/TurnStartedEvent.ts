import { Game } from '../models/Game';

export class TurnStartedEvent {
  readonly type = 'TurnStarted';
  constructor(public readonly game: Game) {}
}
