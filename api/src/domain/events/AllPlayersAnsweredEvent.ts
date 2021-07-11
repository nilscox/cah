import { DomainEvent } from '../../ddd/EventPublisher';
import { Game } from '../models/Game';

export class AllPlayersAnsweredEvent implements DomainEvent {
  readonly type = 'AllPlayersAnswered';
  constructor(public readonly game: Game) {}
}
