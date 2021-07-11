// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DomainEvent {}

export interface EventPublisher {
  publish(event: DomainEvent): void;
}
