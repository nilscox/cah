import { DomainEvent } from '../interfaces/domain-event';
import { LoggerPort } from '../logger/logger.port';
import { ClassType } from '../utils/class-type';
import { defined } from '../utils/defined';

import { EventPublisherPort } from './event-publisher.port';

type EventHandler<Event extends DomainEvent> = (event: Event) => Promise<void>;

export class RealEventPublisherAdapter implements EventPublisherPort {
  private handlers = new Map<string, Array<EventHandler<DomainEvent>>>();

  constructor(private readonly logger: LoggerPort) {
    this.logger.context = 'RealEventPublisher';
  }

  register<Event extends DomainEvent>(event: ClassType<Event>, handler: EventHandler<Event>) {
    const key = event.name;

    if (!this.handlers.has(key)) {
      this.handlers.set(key, []);
    }

    defined(this.handlers.get(key)).push(handler as EventHandler<DomainEvent>);
  }

  publish(event: DomainEvent): void {
    const key = event.constructor.name;

    this.handlers.get(key)?.forEach((handler) => {
      handler(event).catch((error) => {
        this.logger.error(error);
      });
    });
  }
}
