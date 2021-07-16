import { DomainEvent, EventPublisher } from '../../ddd/EventPublisher';

export class StubEventPublisher implements EventPublisher {
  events: DomainEvent[] = [];
  publish = this.events.push.bind(this.events);

  get lastEvent() {
    return this.events[this.events.length - 1];
  }
}
