import { DomainEvent } from '../../ddd/EventPublisher';
import { Game } from '../models/Game';

export class WinnerSelectedEvent implements DomainEvent {
  readonly type = 'WinnerSelected';
  constructor(public readonly game: Game) {}
}
