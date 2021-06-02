export class AlreadyAnsweredError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, AlreadyAnsweredError.prototype);
  }
}
