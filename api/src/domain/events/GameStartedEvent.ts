import { DomainEvent } from '../../ddd/EventPublisher';
import { Game } from '../models/Game';

export class GameStartedEvent implements DomainEvent {
  readonly type = 'GameStarted';
  constructor(public readonly game: Game) {}
}
