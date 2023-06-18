type OptionalPayload<T> = T extends { payload: never } ? Omit<T, 'payload'> : T;

export type DomainEvent<
  Entity extends string = string,
  Type extends string = string,
  Payload = never
> = OptionalPayload<{
  entity: Entity;
  entityId: string;
  type: Type;
  payload: Payload;
}>;
