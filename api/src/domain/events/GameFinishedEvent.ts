import { DomainEvent } from '../../ddd/EventPublisher';
import { Game } from '../models/Game';

export class GameFinishedEvent implements DomainEvent {
  readonly type = 'GameFinished';
  constructor(public readonly game: Game) {}
}
