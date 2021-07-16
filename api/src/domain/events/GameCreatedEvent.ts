import { Game } from '../models/Game';

export class GameCreatedEvent {
  readonly type = 'GameCreated';
  constructor(public readonly game: Game) {}
}
