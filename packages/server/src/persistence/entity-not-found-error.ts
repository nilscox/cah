export class EntityNotFoundError extends Error {
  constructor(public readonly entityName: string, public readonly criteria?: Record<string, unknown>) {
    super(`${entityName} not found`);
  }
}
