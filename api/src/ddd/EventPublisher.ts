export interface EventPublisher<DomainEvent> {
  publish(event: DomainEvent): void;
}
