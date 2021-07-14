import { DomainEvent } from '../../ddd/EventPublisher';
import { Game } from '../models/Game';

export class GameCreatedEvent implements DomainEvent {
  readonly type = 'GameCreated';
  constructor(public readonly game: Game) {}
}
