export interface DomainEvent {
  type: string;
}

export interface EventPublisher {
  publish(event: DomainEvent): void;
}
