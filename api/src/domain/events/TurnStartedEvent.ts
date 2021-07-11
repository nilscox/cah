import { DomainEvent } from '../../ddd/EventPublisher';
import { Game } from '../models/Game';

export class TurnStartedEvent implements DomainEvent {
  readonly type = 'TurnStarted';
  constructor(public readonly game: Game) {}
}
