import { DomainEvent } from '../../interfaces';

export interface EventPublisherPort {
  publish<Event extends DomainEvent>(event: Omit<Event, 'date'>): void;
}
