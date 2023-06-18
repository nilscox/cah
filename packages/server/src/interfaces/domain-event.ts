export class DomainEvent {
  constructor(public readonly entity: string, public readonly entityId: string) {}
}
