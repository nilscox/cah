export class DomainEvent {
  public readonly type;

  constructor(public readonly entity: string, public readonly entityId: string) {
    this.type = this.constructor.name;
  }
}
