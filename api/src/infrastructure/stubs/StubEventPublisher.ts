import { EventPublisher } from '../../ddd/EventPublisher';
import { DomainEvent } from '../../domain/events';

export class StubEventPublisher implements EventPublisher<DomainEvent> {
  events: DomainEvent[] = [];
  publish = this.events.push.bind(this.events);

  get lastEvent() {
    return this.events[this.events.length - 1];
  }
}
