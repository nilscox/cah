import { DomainEvent } from './EventPublisher';

export interface EventHandler {
  execute(event: DomainEvent): void;
}
