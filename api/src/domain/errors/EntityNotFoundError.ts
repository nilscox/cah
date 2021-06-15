export class EntityNotFoundError extends Error {
  constructor(entity: string, field?: string, value?: unknown) {
    super(`${entity} ${field && value !== undefined && `with ${field} = ${String(value)} `}not found`);
    Object.setPrototypeOf(this, EntityNotFoundError.prototype);
  }
}
