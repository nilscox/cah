import { Game } from '../models/Game';

export class GameStartedEvent {
  readonly type = 'GameStarted';
  constructor(public readonly game: Game) {}
}
