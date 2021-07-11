import { Entity } from './Entity';
import { DomainEvent, EventPublisher } from './EventPublisher';

export class AggregateRoot extends Entity {
  private events: DomainEvent[] = [];

  addEvent(event: DomainEvent) {
    this.events.push(event);
  }

  publishEvents(publisher: EventPublisher) {
    for (const event of this.events) {
      publisher.publish(event);
    }
  }
}
