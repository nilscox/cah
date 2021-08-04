import { Logger } from '../application/interfaces/Logger';
import { EventHandler } from '../ddd/EventHandler';
import { EventPublisher } from '../ddd/EventPublisher';
import { DomainEvent } from '../domain/events';

export class PubSub implements EventPublisher<DomainEvent> {
  private handlers: EventHandler<DomainEvent>[] = [];

  constructor(private readonly logger: Logger) {
    this.logger.setContext('PubSub');
  }

  subscribe(handler: EventHandler<DomainEvent>) {
    this.handlers.push(handler);
  }

  publish(event: DomainEvent) {
    this.logger.debug(`publish to ${this.handlers.length} handlers`, { type: event.type });

    for (const handler of this.handlers) {
      handler.execute(event);
    }
  }
}
