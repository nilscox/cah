import { EventHandler } from '../ddd/EventHandler';
import { EventPublisher } from '../ddd/EventPublisher';
import { DomainEvent } from '../domain/events';

export class PubSub implements EventPublisher<DomainEvent> {
  private handlers: EventHandler<DomainEvent>[] = [];

  subscribe(handler: EventHandler<DomainEvent>) {
    this.handlers.push(handler);
  }

  publish(event: DomainEvent) {
    for (const handler of this.handlers) {
      handler.execute(event);
    }
  }
}
