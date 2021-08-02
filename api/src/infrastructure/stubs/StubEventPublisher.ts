import { EventPublisher } from '../../ddd/EventPublisher';
import { DomainEvent } from '../../domain/events';

export class StubEventPublisher implements EventPublisher<DomainEvent> {
  events: DomainEvent[] = [];
  publish = this.events.push.bind(this.events);

  get firstEvent() {
    return this.events[0];
  }

  get lastEvent() {
    return this.events[this.events.length - 1];
  }

  findEvent(type: DomainEvent['type']) {
    return this.events.find((event) => event.type === type);
  }
}
