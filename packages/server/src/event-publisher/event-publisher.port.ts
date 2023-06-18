import { DomainEvent } from '../interfaces/domain-event';

export interface EventPublisherPort {
  publish<Event extends DomainEvent>(event: Omit<Event, 'date'>): void;
}
