import { DomainEvent } from '../../ddd/EventPublisher';
import { Game } from '../models/Game';

export class TurnFinishedEvent implements DomainEvent {
  readonly type = 'TurnFinished';
  constructor(public readonly game: Game) {}
}
