export class GameAlreadyStartedError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, GameAlreadyStartedError.prototype);
  }
}
