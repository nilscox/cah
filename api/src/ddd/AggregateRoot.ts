import { Entity } from './Entity';
import { EventPublisher } from './EventPublisher';

export class AggregateRoot<DomainEvent> extends Entity {
  private events: DomainEvent[] = [];

  addEvent(event: DomainEvent) {
    this.events.push(event);
  }

  dropEvents() {
    this.events = [];
  }

  publishEvents(publisher: EventPublisher<DomainEvent>) {
    for (const event of this.events) {
      publisher.publish(event);
    }
  }
}
