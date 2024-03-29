import { DomainEvent } from 'src/interfaces';

export interface EventPublisherPort {
  publish<Event extends DomainEvent>(event: Event): void;
}
