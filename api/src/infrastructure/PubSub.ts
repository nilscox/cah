import { EventHandler } from '../ddd/EventHandler';
import { DomainEvent, EventPublisher } from '../ddd/EventPublisher';

export class PubSub implements EventPublisher {
  private handlers: EventHandler[] = [];

  subscribe(handler: EventHandler) {
    this.handlers.push(handler);
  }

  publish(event: DomainEvent) {
    for (const handler of this.handlers) {
      handler.execute(event);
    }
  }
}
