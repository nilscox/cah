import { DomainEvent } from '../../ddd/EventPublisher';
import { Choice } from '../models/Choice';
import { Player } from '../models/Player';

export class CardsDealtEvent implements DomainEvent {
  readonly type = 'CardsDealt';
  constructor(public readonly player: Player, public readonly cards: Choice[]) {}
}
