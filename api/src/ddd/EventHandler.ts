export interface EventHandler<DomainEvent> {
  execute(event: DomainEvent): void;
}
